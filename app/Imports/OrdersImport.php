<?php

namespace App\Imports;

use App\Helpers\OrderHelper;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Pembayaran;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class OrdersImport implements ToCollection, WithStartRow
{
    /**
     * @return int
     */
    public function startRow(): int
    {
        return 2; // Lewati baris 1 (header)
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $userId = Auth::id() ?? 1; // Fallback jika dijalankan via console

        foreach ($rows as $row) {
            // Cek apakah kolom CUSTOMER kosong, jika ya, anggap baris kosong/akhir
            $customerName = trim((string) ($row[2] ?? ''));
            if (empty($customerName)) {
                continue;
            }

            try {
                // 1. Parsing Tanggal (Kolom 0)
                $tanggalOrder = now();
                if (isset($row[0]) && is_numeric($row[0])) {
                    $tanggalOrder = Date::excelToDateTimeObject($row[0]);
                } elseif (!empty($row[0])) {
                    try {
                        $tanggalOrder = Carbon::parse($row[0]);
                    } catch (\Exception $e) {
                        // fallback
                    }
                }

                // 2. Customer
                $customer = Customer::firstOrCreate(
                    ['nama' => $customerName],
                    ['kontak' => '-'] // default kontak
                );

                // 3. Ekstraksi Data
                $noResi      = trim((string) ($row[1] ?? ''));
                $bahan       = trim((string) ($row[3] ?? ''));
                $jenisProduk = trim((string) ($row[4] ?? 'Lainnya'));
                $tenggatWaktu = trim((string) ($row[5] ?? ''));
                $qty         = (int) ($row[6] ?? 1);
                
                $penjahit    = trim((string) ($row[11] ?? ''));
                $kategori    = trim((string) ($row[12] ?? ''));
                
                $totalHarga  = (float) ($row[14] ?? 0);
                
                $deadline = Carbon::parse($tanggalOrder)->addDays(14);
                if (isset($row[7]) && is_numeric($row[7])) {
                    $deadline = Date::excelToDateTimeObject($row[7]);
                } elseif (!empty($row[7])) {
                    try {
                        $deadline = Carbon::parse($row[7]);
                    } catch (\Exception $e) {}
                }

                // DPs (Kolom 15 sampai 20)
                $dps = [
                    'dp1'       => (float) ($row[15] ?? 0),
                    'dp2'       => (float) ($row[16] ?? 0),
                    'dp3'       => (float) ($row[17] ?? 0),
                    'dp4'       => (float) ($row[18] ?? 0),
                    'dp5'       => (float) ($row[19] ?? 0),
                    'pelunasan' => (float) ($row[20] ?? 0),
                ];

                $totalDp = array_sum($dps);
                $sisaBayar = $totalHarga - $totalDp;

                // Catatan
                $catatan = '';
                if (!empty($noResi)) {
                    $catatan .= "No Resi Excel: " . $noResi . "\n";
                }
                if (!empty($kategori)) {
                    $catatan .= "Kategori: " . $kategori . "\n";
                }
                $ket = trim((string) ($row[24] ?? ''));
                if (!empty($ket)) {
                    $catatan .= "Ket Excel: " . $ket;
                }
                
                $catatanProduksi = '';
                if (!empty($bahan)) {
                    $catatanProduksi .= "Bahan: " . $bahan . "\n";
                }
                if (!empty($tenggatWaktu)) {
                    $catatanProduksi .= "Tenggat Waktu Excel: " . $tenggatWaktu . "\n";
                }
                if (!empty($penjahit)) {
                    $catatanProduksi .= "Penjahit: " . $penjahit . "\n";
                }

                $status = ($sisaBayar <= 0) ? Order::STATUS_SELESAI : Order::STATUS_DRAFT;

                // 4. Buat Order
                $order = Order::create([
                    'no_order'       => OrderHelper::generateNoOrder(),
                    'customer_id'    => $customer->id,
                    'tanggal_order'  => $tanggalOrder,
                    'deadline'       => $deadline,
                    'status'         => Order::STATUS_DRAFT,
                    'jenis_produk'   => $jenisProduk,
                    'jumlah'         => $qty > 0 ? $qty : 1,
                    'total_harga'    => $totalHarga,
                    'dp'             => $totalDp,
                    'sisa_bayar'     => $sisaBayar,
                    'catatan'        => trim($catatan),
                    'catatan_produksi' => trim($catatanProduksi),
                    'created_by'     => $userId,
                ]);

                // 5. Buat OrderItem
                $order->items()->create([
                    'jenis_produk' => $jenisProduk,
                    'ukuran'       => null,
                    'jumlah_pcs'   => $qty > 0 ? $qty : 1,
                ]);

                // 6. Buat OrderLog
                OrderLog::create([
                    'order_id'    => $order->id,
                    'user_id'     => $userId,
                    'status_lama' => null,
                    'status_baru' => Order::STATUS_DRAFT,
                    'catatan'     => 'Order diimpor dari Excel',
                ]);

                // 7. Buat Pembayaran (Cicilan)
                foreach ($dps as $tipe => $jumlahPembayaran) {
                    if ($jumlahPembayaran > 0) {
                        Pembayaran::create([
                            'order_id'     => $order->id,
                            'jumlah'       => $jumlahPembayaran,
                            'tanggal'      => $tanggalOrder, // Gunakan tanggal order sbg default tanggal masuk
                            'metode'       => 'transfer',
                            'tipe'         => $tipe == 'pelunasan' ? 'pelunasan' : 'dp',
                            'catatan'      => strtoupper($tipe) . ' (Import)',
                            'dicatat_oleh' => $userId,
                        ]);
                    }
                }

            } catch (\Exception $e) {
                Log::error("Gagal import baris order excel: " . $e->getMessage(), ['row' => $row]);
                // Lanjut ke baris berikutnya
            }
        }
    }
}
