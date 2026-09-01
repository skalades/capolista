<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DesainController;
use App\Http\Controllers\GudangController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PemasanganController;
use App\Http\Controllers\PrintingController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Models\OrderFile;
use Illuminate\Support\Facades\Route;

// Root redirect ke dashboard
Route::get('/', fn () => redirect()->route('dashboard'));

// Cek Pesanan (Public)
Route::get('/cek-pesanan', [\App\Http\Controllers\TrackOrderController::class, 'index'])->name('cek-pesanan');

Route::middleware(['auth', 'verified', 'active'])->group(function () {

    // --- Dashboard ---
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- Profile ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- Customer ---
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');

    // --- Level 0,1,2 (Manajemen) ---
    Route::middleware('level:0,1,2')->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
        Route::post('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
        Route::post('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
        
        Route::resource('orders', OrderController::class)->except(['show']);
        Route::post('/orders/{order}/update-status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
        Route::post('/orders/{order}/upload-file', [OrderController::class, 'uploadFile'])->name('orders.upload-file');
        Route::delete('/order-files/{file}', [OrderController::class, 'deleteFile'])->name('orders.delete-file');
        Route::get('/orders/{order}/spk', [OrderController::class, 'printSpk'])->name('orders.spk');
        Route::get('/orders/{order}/invoice', [OrderController::class, 'printInvoice'])->name('orders.invoice');
    });

    // Orders Show (Accessible to all staffs that might need it)
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // --- Divisi Scopes ---
    // Desain
    Route::middleware(['level:0,2,3,4', 'divisi:desain'])->group(function () {
        Route::get('/desain', [DesainController::class, 'index'])->name('desain.index');
        Route::get('/desain/{order}', [DesainController::class, 'show'])->name('desain.show');
        Route::post('/desain/{order}/upload-mockup', [DesainController::class, 'uploadMockup'])->name('desain.upload-mockup');
        Route::patch('/desain/{desain}', [DesainController::class, 'update'])->name('desain.update');
        Route::middleware('level:0,1,2,3')->group(function () {
            Route::post('/desain/{desain}/approve', [DesainController::class, 'approve'])->name('desain.approve');
            Route::post('/desain/{desain}/reject', [DesainController::class, 'reject'])->name('desain.reject');
        });
    });

    // Printing
    Route::middleware(['level:0,2,3,4', 'divisi:printing'])->group(function () {
        Route::get('/printing', [PrintingController::class, 'index'])->name('printing.index');
        Route::get('/printing/{order}', [PrintingController::class, 'show'])->name('printing.show');
        Route::patch('/printing/{printing}', [PrintingController::class, 'update'])->name('printing.update');
        Route::post('/printing/{printing}/complete', [PrintingController::class, 'complete'])->name('printing.complete');
    });

    // Pemasangan
    Route::middleware(['level:0,2,3,4', 'divisi:pemasangan'])->group(function () {
        Route::get('/pemasangan', [PemasanganController::class, 'index'])->name('pemasangan.index');
        Route::get('/pemasangan/{order}', [PemasanganController::class, 'show'])->name('pemasangan.show');
        Route::patch('/pemasangan/{pemasangan}', [PemasanganController::class, 'update'])->name('pemasangan.update');
        Route::post('/pemasangan/{pemasangan}/complete', [PemasanganController::class, 'complete'])->name('pemasangan.complete');
    });

    // Produksi (Koordinator)
    Route::middleware(['level:0,2,3,4', 'divisi:produksi'])->group(function () {
        Route::get('/produksi', [ProduksiController::class, 'index'])->name('produksi.index');
    });

    // Gudang
    Route::middleware(['level:0,2,3,4', 'divisi:gudang'])->group(function () {
        Route::get('/gudang', [GudangController::class, 'index'])->name('gudang.index');
        Route::get('/gudang/stok', [GudangController::class, 'stokIndex'])->name('gudang.stok');
        Route::post('/gudang/stok', [GudangController::class, 'stokStore'])->name('gudang.stok.store');
        Route::patch('/gudang/stok/{stok}', [GudangController::class, 'stokUpdate'])->name('gudang.stok.update');
        Route::get('/gudang/packing/{order}', [GudangController::class, 'packingShow'])->name('gudang.packing.show');
        Route::patch('/gudang/packing/{packing}', [GudangController::class, 'packingUpdate'])->name('gudang.packing.update');
        Route::get('/gudang/opname', [GudangController::class, 'opnameIndex'])->name('gudang.opname.index');
        Route::get('/gudang/opname/create', [GudangController::class, 'opnameCreate'])->name('gudang.opname.create');
        Route::post('/gudang/opname', [GudangController::class, 'opnameStore'])->name('gudang.opname.store');
        Route::get('/gudang/opname/{opname}', [GudangController::class, 'opnameShow'])->name('gudang.opname.show');
        Route::post('/gudang/opname/{opname}/submit', [GudangController::class, 'opnameSubmit'])->name('gudang.opname.submit');
        Route::post('/gudang/opname/{opname}/approve', [GudangController::class, 'opnameApprove'])->name('gudang.opname.approve');
    });

    // Keuangan
    Route::prefix('keuangan')->name('keuangan.')->middleware(['level:0,1,2,3,4', 'divisi:keuangan'])->group(function() {
        Route::get('/', [\App\Http\Controllers\KeuanganController::class, 'index'])->name('index');
        Route::get('/pembayaran', [\App\Http\Controllers\KeuanganController::class, 'pembayaranIndex'])->name('pembayaran.index');
        Route::post('/pembayaran', [\App\Http\Controllers\KeuanganController::class, 'pembayaranStore'])->name('pembayaran.store');
        Route::get('/pengeluaran', [\App\Http\Controllers\KeuanganController::class, 'pengeluaranIndex'])->name('pengeluaran.index');
        Route::post('/pengeluaran', [\App\Http\Controllers\KeuanganController::class, 'pengeluaranStore'])->name('pengeluaran.store');
        Route::get('/laporan', [\App\Http\Controllers\KeuanganController::class, 'laporanLabaRugi'])->name('laporan');
    });

    // Procurement
    Route::prefix('procurement')->name('procurement.')->middleware(['level:0,1,2,3,4', 'divisi:pembelian'])->group(function() {
        Route::get('/', [\App\Http\Controllers\ProcurementController::class, 'index'])->name('index');
        
        // Use custom methods instead of resource to avoid conflicting names
        Route::get('/supplier', [\App\Http\Controllers\ProcurementController::class, 'supplierIndex'])->name('supplier.index');
        Route::post('/supplier', [\App\Http\Controllers\ProcurementController::class, 'supplierStore'])->name('supplier.store');
        Route::put('/supplier/{supplier}', [\App\Http\Controllers\ProcurementController::class, 'supplierUpdate'])->name('supplier.update');
        Route::delete('/supplier/{supplier}', [\App\Http\Controllers\ProcurementController::class, 'supplierDestroy'])->name('supplier.destroy');
        
        Route::get('/po', [\App\Http\Controllers\ProcurementController::class, 'poIndex'])->name('po.index');
        Route::get('/po/create', [\App\Http\Controllers\ProcurementController::class, 'poCreate'])->name('po.create');
        Route::post('/po', [\App\Http\Controllers\ProcurementController::class, 'poStore'])->name('po.store');
        Route::get('/po/{po}', [\App\Http\Controllers\ProcurementController::class, 'poShow'])->name('po.show');
        Route::patch('/po/{po}/status', [\App\Http\Controllers\ProcurementController::class, 'poUpdateStatus'])->name('po.update-status');
    });
    // Laporan
    Route::prefix('laporan')->name('laporan.')->middleware('level:0,1,2')->group(function() {
        Route::get('/', [\App\Http\Controllers\LaporanController::class, 'index'])->name('index');
        Route::get('/produksi', [\App\Http\Controllers\LaporanController::class, 'produksi'])->name('produksi');
        Route::get('/keuangan', [\App\Http\Controllers\LaporanController::class, 'keuangan'])->name('keuangan');
        Route::get('/divisi', [\App\Http\Controllers\LaporanController::class, 'divisi'])->name('divisi');
    });

    // Superadmin
    Route::prefix('superadmin')->name('superadmin.')->middleware('level:0')->group(function() {
        Route::get('/', [\App\Http\Controllers\SuperadminController::class, 'index'])->name('index');
        Route::get('/roles', [\App\Http\Controllers\SuperadminController::class, 'roleIndex'])->name('roles');
        Route::post('/roles', [\App\Http\Controllers\SuperadminController::class, 'roleStore'])->name('roles.store');
        Route::patch('/roles/{role}', [\App\Http\Controllers\SuperadminController::class, 'roleUpdate'])->name('roles.update');
        Route::delete('/roles/{role}', [\App\Http\Controllers\SuperadminController::class, 'roleDestroy'])->name('roles.destroy');
        Route::get('/sistem', [\App\Http\Controllers\SuperadminController::class, 'sistemInfo'])->name('sistem');
    });
});

require __DIR__ . '/auth.php';
