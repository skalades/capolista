<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\Penggajian;
use App\Models\ProduksiJahitOutput;
use App\Models\User;
use App\Services\PenggajianService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HRController extends Controller
{
    public function __construct(private readonly PenggajianService $penggajianService)
    {
    }

    // ===========================
    // ABSENSI
    // ===========================

    /**
     * Halaman input absensi (oleh Admin/Mandor).
     */
    public function absensiIndex(Request $request)
    {
        $divisi  = $request->input('divisi', auth()->user()->divisi ?? array_key_first(User::DIVISI_LIST));
        $tanggal = $request->input('tanggal', today()->toDateString());

        // Daftar karyawan di divisi yang dipilih
        $karyawanList = User::active()
            ->where('divisi', $divisi)
            ->whereIn('level_akses', [User::LEVEL_KEPALA_DIVISI, User::LEVEL_STAF])
            ->orderBy('name')
            ->get(['id', 'name', 'jabatan', 'tipe_gaji', 'divisi']);

        // Absensi yang sudah ada untuk tanggal ini
        $absensiHariIni = Absensi::where('tanggal', $tanggal)
            ->whereIn('karyawan_id', $karyawanList->pluck('id'))
            ->get()
            ->keyBy('karyawan_id');

        // Rekap absensi bulan ini per karyawan
        $rekapBulan = Absensi::whereIn('karyawan_id', $karyawanList->pluck('id'))
            ->whereMonth('tanggal', now()->month)
            ->whereYear('tanggal', now()->year)
            ->selectRaw('karyawan_id, status_hadir, count(*) as total')
            ->groupBy('karyawan_id', 'status_hadir')
            ->get()
            ->groupBy('karyawan_id');

        return Inertia::render('HR/Absensi', [
            'karyawanList'   => $karyawanList,
            'absensiHariIni' => $absensiHariIni,
            'rekapBulan'     => $rekapBulan,
            'divisiList'     => User::DIVISI_LIST,
            'filters'        => ['divisi' => $divisi, 'tanggal' => $tanggal],
        ]);
    }

    /**
     * Simpan absensi batch (satu divisi satu hari).
     */
    public function absensiStore(Request $request)
    {
        $validated = $request->validate([
            'tanggal'            => 'required|date|before_or_equal:today',
            'absensi'            => 'required|array',
            'absensi.*.karyawan_id' => 'required|exists:users,id',
            'absensi.*.status_hadir' => 'required|in:hadir,izin,sakit,alpha',
            'absensi.*.jam_lembur'   => 'nullable|numeric|min:0|max:12',
            'absensi.*.keterangan'   => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['absensi'] as $row) {
                Absensi::updateOrCreate(
                    [
                        'karyawan_id' => $row['karyawan_id'],
                        'tanggal'     => $validated['tanggal'],
                    ],
                    [
                        'status_hadir' => $row['status_hadir'],
                        'jam_lembur'   => $row['jam_lembur'] ?? 0,
                        'dicatat_oleh' => auth()->id(),
                        'keterangan'   => $row['keterangan'] ?? null,
                    ]
                );
            }
        });

        return back()->with('success', 'Absensi berhasil disimpan.');
    }

    /**
     * Rekap absensi per karyawan untuk periode tertentu.
     */
    public function absensiRekap(Request $request)
    {
        $divisi      = $request->input('divisi', '');
        $bulan       = $request->input('bulan', now()->month);
        $tahun       = $request->input('tahun', now()->year);

        $query = User::active()
            ->whereIn('level_akses', [User::LEVEL_KEPALA_DIVISI, User::LEVEL_STAF]);

        if ($divisi) {
            $query->where('divisi', $divisi);
        }

        $karyawanList = $query->orderBy('divisi')->orderBy('name')->get(['id', 'name', 'divisi', 'tipe_gaji']);

        $rekapData = Absensi::whereIn('karyawan_id', $karyawanList->pluck('id'))
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->selectRaw('karyawan_id, status_hadir, count(*) as total, sum(jam_lembur) as total_lembur')
            ->groupBy('karyawan_id', 'status_hadir')
            ->get()
            ->groupBy('karyawan_id');

        return Inertia::render('HR/AbsensiRekap', [
            'karyawanList' => $karyawanList,
            'rekapData'    => $rekapData,
            'divisiList'   => User::DIVISI_LIST,
            'filters'      => ['divisi' => $divisi, 'bulan' => $bulan, 'tahun' => $tahun],
        ]);
    }

    // ===========================
    // PENGGAJIAN
    // ===========================

    /**
     * Daftar slip gaji yang sudah digenerate.
     */
    public function penggajianIndex(Request $request)
    {
        $query = Penggajian::with(['karyawan'])
            ->latest('periode_selesai');

        if ($request->filled('divisi')) {
            $query->whereHas('karyawan', fn ($q) => $q->where('divisi', $request->divisi));
        }

        if ($request->filled('tipe_gaji')) {
            $query->where('tipe_gaji', $request->tipe_gaji);
        }

        $penggajians = $query->paginate(20)->withQueryString();

        // Summary bulan ini
        $summary = [
            'total_draft'     => Penggajian::where('status_bayar', Penggajian::STATUS_DRAFT)->count(),
            'total_disetujui' => Penggajian::where('status_bayar', Penggajian::STATUS_DISETUJUI)->count(),
            'total_dibayar'   => Penggajian::where('status_bayar', Penggajian::STATUS_DIBAYAR)
                ->whereMonth('periode_selesai', now()->month)->sum('total_upah_bersih'),
        ];

        return Inertia::render('HR/Penggajian', [
            'penggajians' => $penggajians,
            'summary'     => $summary,
            'divisiList'  => User::DIVISI_LIST,
            'filters'     => $request->only(['divisi', 'tipe_gaji']),
        ]);
    }

    /**
     * Form generate slip gaji.
     */
    public function penggajianCreate(Request $request)
    {
        $karyawanList = User::active()
            ->whereIn('level_akses', [User::LEVEL_KEPALA_DIVISI, User::LEVEL_STAF])
            ->whereNotNull('tipe_gaji')
            ->orderBy('divisi')
            ->orderBy('name')
            ->get(['id', 'name', 'divisi', 'tipe_gaji', 'tarif_default']);

        return Inertia::render('HR/PenggajianCreate', [
            'karyawanList' => $karyawanList,
            'divisiList'   => User::DIVISI_LIST,
        ]);
    }

    /**
     * Generate slip gaji untuk karyawan tertentu.
     */
    public function penggajianGenerate(Request $request)
    {
        $validated = $request->validate([
            'karyawan_ids'   => 'required|array|min:1',
            'karyawan_ids.*' => 'required|exists:users,id',
            'periode_mulai'  => 'required|date',
            'periode_selesai' => 'required|date|after_or_equal:periode_mulai',
        ]);

        $berhasil = 0;
        $gagal    = [];

        foreach ($validated['karyawan_ids'] as $karyawanId) {
            try {
                $karyawan = User::findOrFail($karyawanId);
                $this->penggajianService->generate(
                    $karyawan,
                    $validated['periode_mulai'],
                    $validated['periode_selesai'],
                    auth()->id()
                );
                $berhasil++;
            } catch (\Exception $e) {
                $gagal[] = "Karyawan #{$karyawanId}: " . $e->getMessage();
            }
        }

        $message = "Slip gaji berhasil digenerate: {$berhasil} karyawan.";
        if ($gagal) {
            $message .= " Gagal: " . implode(', ', $gagal);
        }

        return redirect()->route('hr.penggajian.index')->with('success', $message);
    }

    /**
     * Detail slip gaji.
     */
    public function penggajianShow(Penggajian $penggajian)
    {
        $penggajian->load(['karyawan', 'items.order', 'pembuat', 'penyetuju']);

        return Inertia::render('HR/SlipGaji', [
            'penggajian' => $penggajian,
        ]);
    }

    /**
     * Approve slip gaji.
     */
    public function penggajianApprove(Request $request, Penggajian $penggajian)
    {
        if (!$penggajian->isDraft()) {
            return back()->with('error', 'Hanya slip gaji draft yang dapat disetujui.');
        }

        $penggajian->update([
            'status_bayar'  => Penggajian::STATUS_DISETUJUI,
            'disetujui_oleh' => auth()->id(),
            'disetujui_at'  => now(),
        ]);

        return back()->with('success', 'Slip gaji disetujui.');
    }

    /**
     * Tandai slip gaji sebagai sudah dibayar.
     */
    public function penggajianBayar(Request $request, Penggajian $penggajian)
    {
        if (!$penggajian->isDisetujui()) {
            return back()->with('error', 'Slip gaji harus disetujui dulu sebelum ditandai dibayar.');
        }

        $penggajian->update([
            'status_bayar' => Penggajian::STATUS_DIBAYAR,
            'dibayar_at'   => now(),
        ]);

        return back()->with('success', 'Slip gaji ditandai sebagai sudah dibayar.');
    }

    /**
     * Print slip gaji sebagai PDF.
     */
    public function penggajianPrint(Penggajian $penggajian)
    {
        $penggajian->load(['karyawan', 'items.order', 'pembuat']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.slip-gaji', [
            'penggajian' => $penggajian,
        ]);

        return $pdf->download("slip-gaji-{$penggajian->karyawan->name}-{$penggajian->periode_mulai}.pdf");
    }

    // ===========================
    // OUTPUT BORONGAN (untuk mandor jahit dari menu HR)
    // ===========================

    /**
     * Rekap output harian semua operator borongan.
     */
    public function outputRekap(Request $request)
    {
        $tanggal = $request->input('tanggal', today()->toDateString());
        $divisi  = $request->input('divisi', 'jahit');

        $outputs = ProduksiJahitOutput::with(['operator', 'order.customer'])
            ->whereDate('tanggal', $tanggal)
            ->whereHas('operator', fn ($q) => $q->where('divisi', $divisi))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'menunggu'  => ProduksiJahitOutput::whereDate('tanggal', $tanggal)->where('status', ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL)->count(),
            'approved'  => ProduksiJahitOutput::whereDate('tanggal', $tanggal)->where('status', ProduksiJahitOutput::STATUS_APPROVED)->count(),
            'total_pcs' => ProduksiJahitOutput::whereDate('tanggal', $tanggal)->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('pcs_approved'),
            'total_upah' => ProduksiJahitOutput::whereDate('tanggal', $tanggal)->where('status', ProduksiJahitOutput::STATUS_APPROVED)->sum('upah_kotor'),
        ];

        return Inertia::render('HR/OutputRekap', [
            'outputs' => $outputs,
            'stats'   => $stats,
            'filters' => ['tanggal' => $tanggal, 'divisi' => $divisi],
        ]);
    }
}
