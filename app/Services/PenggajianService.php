<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Absensi;
use App\Models\Penggajian;
use App\Models\PenggajianItem;
use App\Models\ProduksiJahitOutput;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PenggajianService
{
    /**
     * Generate slip gaji untuk satu karyawan dalam periode tertentu.
     *
     * @param  User   $karyawan
     * @param  string $periodeMulai  Format: YYYY-MM-DD
     * @param  string $periodeSelesai Format: YYYY-MM-DD
     * @param  int    $dibuatOleh    User ID yang men-generate
     * @return Penggajian
     * @throws \Exception
     */
    public function generate(User $karyawan, string $periodeMulai, string $periodeSelesai, int $dibuatOleh): Penggajian
    {
        return DB::transaction(function () use ($karyawan, $periodeMulai, $periodeSelesai, $dibuatOleh) {
            // Hapus draft lama jika ada (boleh regenerate)
            Penggajian::where('karyawan_id', $karyawan->id)
                ->where('periode_mulai', $periodeMulai)
                ->where('periode_selesai', $periodeSelesai)
                ->where('status_bayar', Penggajian::STATUS_DRAFT)
                ->delete();

            $tipeGaji = $karyawan->tipe_gaji ?? 'bulanan';

            // Hitung rekap absensi
            $absensiData = $this->hitungAbsensi($karyawan->id, $periodeMulai, $periodeSelesai);

            // Hitung upah berdasarkan tipe
            $kalkulasi = match ($tipeGaji) {
                'borongan' => $this->hitungBorongan($karyawan, $periodeMulai, $periodeSelesai),
                'harian'   => $this->hitungHarian($karyawan, $absensiData),
                'bulanan'  => $this->hitungBulanan($karyawan, $absensiData),
                default    => $this->hitungBulanan($karyawan, $absensiData),
            };

            $totalUpahKotor = $kalkulasi['upah_pokok'] + $kalkulasi['upah_lembur'] + ($kalkulasi['tunjangan'] ?? 0);
            $potongan        = $kalkulasi['potongan'] ?? 0;
            $totalUpahBersih = max(0, $totalUpahKotor - $potongan);

            $penggajian = Penggajian::create([
                'karyawan_id'        => $karyawan->id,
                'periode_mulai'      => $periodeMulai,
                'periode_selesai'    => $periodeSelesai,
                'tipe_gaji'          => $tipeGaji,
                'total_hari_hadir'   => $absensiData['hadir'],
                'total_hari_izin'    => $absensiData['izin'],
                'total_hari_sakit'   => $absensiData['sakit'],
                'total_hari_alpha'   => $absensiData['alpha'],
                'total_jam_lembur'   => $absensiData['total_jam_lembur'],
                'total_pcs_approved' => $kalkulasi['total_pcs'] ?? 0,
                'upah_pokok'         => $kalkulasi['upah_pokok'],
                'upah_lembur'        => $kalkulasi['upah_lembur'],
                'tunjangan'          => $kalkulasi['tunjangan'] ?? 0,
                'potongan'           => $potongan,
                'catatan_potongan'   => $kalkulasi['catatan_potongan'] ?? null,
                'total_upah_kotor'   => $totalUpahKotor,
                'total_upah_bersih'  => $totalUpahBersih,
                'status_bayar'       => Penggajian::STATUS_DRAFT,
                'dibuat_oleh'        => $dibuatOleh,
            ]);

            // Buat item rincian
            foreach ($kalkulasi['items'] as $item) {
                PenggajianItem::create(array_merge($item, ['penggajian_id' => $penggajian->id]));
            }

            return $penggajian;
        });
    }

    /**
     * Hitung rekap absensi karyawan dalam periode.
     */
    private function hitungAbsensi(int $karyawanId, string $mulai, string $selesai): array
    {
        $rows = Absensi::where('karyawan_id', $karyawanId)
            ->whereBetween('tanggal', [$mulai, $selesai])
            ->get();

        return [
            'hadir'           => $rows->where('status_hadir', Absensi::STATUS_HADIR)->count(),
            'izin'            => $rows->where('status_hadir', Absensi::STATUS_IZIN)->count(),
            'sakit'           => $rows->where('status_hadir', Absensi::STATUS_SAKIT)->count(),
            'alpha'           => $rows->where('status_hadir', Absensi::STATUS_ALPHA)->count(),
            'total_jam_lembur' => (float) $rows->sum('jam_lembur'),
            'rows'            => $rows,
        ];
    }

    /**
     * Hitung upah borongan berdasarkan output harian yang sudah diapprove.
     * Menggunakan tarif snapshot (immutable) — perubahan tarif tidak retroaktif.
     */
    private function hitungBorongan(User $karyawan, string $mulai, string $selesai): array
    {
        $outputs = ProduksiJahitOutput::with('order')
            ->where('operator_id', $karyawan->id)
            ->where('status', ProduksiJahitOutput::STATUS_APPROVED)
            ->whereBetween('tanggal', [$mulai, $selesai])
            ->get();

        $totalPcs   = 0;
        $upahPokok  = 0.0;
        $items      = [];

        foreach ($outputs as $output) {
            $pcs        = (int) $output->pcs_approved;
            $tarif      = (float) $output->tarif_per_pcs_snapshot;
            $subtotal   = $pcs * $tarif;
            $totalPcs  += $pcs;
            $upahPokok += $subtotal;

            $items[] = [
                'tipe_item'   => PenggajianItem::TIPE_BORONGAN,
                'tanggal'     => $output->tanggal->toDateString(),
                'order_id'    => $output->order_id,
                'jenis_produk' => $output->jenis_produk,
                'pcs'         => $pcs,
                'tarif'       => $tarif,
                'subtotal'    => $subtotal,
                'keterangan'  => "Order #{$output->order->no_order} - {$output->jenis_produk}",
            ];
        }

        return [
            'upah_pokok'  => $upahPokok,
            'upah_lembur' => 0.0,
            'tunjangan'   => 0.0,
            'potongan'    => 0.0,
            'total_pcs'   => $totalPcs,
            'items'       => $items,
        ];
    }

    /**
     * Hitung upah harian berdasarkan absensi + lembur.
     */
    private function hitungHarian(User $karyawan, array $absensiData): array
    {
        $tarifHarian  = (float) ($karyawan->tarif_default ?? 0);
        $tarifLembur  = (float) ($karyawan->tarif_lembur ?? 0);
        $hariHadir    = $absensiData['hadir'];
        $jamLembur    = $absensiData['total_jam_lembur'];

        $upahPokok    = $hariHadir * $tarifHarian;
        $upahLembur   = $jamLembur * $tarifLembur;

        $items = [];

        // Item per hari hadir
        foreach ($absensiData['rows'] as $absensi) {
            if ($absensi->status_hadir === Absensi::STATUS_HADIR) {
                $lembur    = (float) $absensi->jam_lembur;
                $subLembur = $lembur * $tarifLembur;
                $items[] = [
                    'tipe_item'   => PenggajianItem::TIPE_HARIAN,
                    'tanggal'     => $absensi->tanggal->toDateString(),
                    'order_id'    => null,
                    'jenis_produk' => null,
                    'pcs'         => null,
                    'tarif'       => $tarifHarian,
                    'subtotal'    => $tarifHarian,
                    'keterangan'  => 'Hadir',
                ];
                if ($lembur > 0) {
                    $items[] = [
                        'tipe_item'   => PenggajianItem::TIPE_LEMBUR,
                        'tanggal'     => $absensi->tanggal->toDateString(),
                        'order_id'    => null,
                        'jenis_produk' => null,
                        'pcs'         => null,
                        'tarif'       => $tarifLembur,
                        'subtotal'    => $subLembur,
                        'keterangan'  => "Lembur {$lembur} jam",
                    ];
                }
            }
        }

        return [
            'upah_pokok'  => $upahPokok,
            'upah_lembur' => $upahLembur,
            'tunjangan'   => 0.0,
            'potongan'    => 0.0,
            'total_pcs'   => 0,
            'items'       => $items,
        ];
    }

    /**
     * Hitung upah bulanan (gaji pokok + lembur - potongan alpha).
     */
    private function hitungBulanan(User $karyawan, array $absensiData): array
    {
        $gajiPokok   = (float) ($karyawan->tarif_default ?? 0);
        $tarifLembur = (float) ($karyawan->tarif_lembur ?? 0);
        $jamLembur   = $absensiData['total_jam_lembur'];
        $upahLembur  = $jamLembur * $tarifLembur;

        // Potongan alpha: per hari alpha = gaji_pokok / 26 (asumsi 26 hari kerja/bulan)
        $hariKerja   = 26;
        $tarifPerHari = $gajiPokok / $hariKerja;
        $potonganAlpha = $absensiData['alpha'] * $tarifPerHari;

        $items = [];
        $items[] = [
            'tipe_item'    => PenggajianItem::TIPE_HARIAN, // reuse untuk gaji pokok
            'tanggal'      => null,
            'order_id'     => null,
            'jenis_produk' => null,
            'pcs'          => null,
            'tarif'        => $gajiPokok,
            'subtotal'     => $gajiPokok,
            'keterangan'   => 'Gaji Pokok Bulanan',
        ];

        if ($upahLembur > 0) {
            $items[] = [
                'tipe_item'    => PenggajianItem::TIPE_LEMBUR,
                'tanggal'      => null,
                'order_id'     => null,
                'jenis_produk' => null,
                'pcs'          => null,
                'tarif'        => $tarifLembur,
                'subtotal'     => $upahLembur,
                'keterangan'   => "Lembur {$jamLembur} jam",
            ];
        }

        if ($potonganAlpha > 0) {
            $items[] = [
                'tipe_item'    => PenggajianItem::TIPE_POTONGAN,
                'tanggal'      => null,
                'order_id'     => null,
                'jenis_produk' => null,
                'pcs'          => null,
                'tarif'        => $tarifPerHari,
                'subtotal'     => $potonganAlpha,
                'keterangan'   => "Potongan Alpha {$absensiData['alpha']} hari",
            ];
        }

        return [
            'upah_pokok'      => $gajiPokok,
            'upah_lembur'     => $upahLembur,
            'tunjangan'       => 0.0,
            'potongan'        => $potonganAlpha,
            'catatan_potongan' => $absensiData['alpha'] > 0 ? "Alpha {$absensiData['alpha']} hari × Rp " . number_format($tarifPerHari, 0, ',', '.') : null,
            'total_pcs'       => 0,
            'items'           => $items,
        ];
    }
}
