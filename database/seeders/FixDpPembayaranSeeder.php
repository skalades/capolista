<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Pembayaran;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * FixDpPembayaranSeeder
 *
 * Migrasi data lama: untuk setiap order yang memiliki dp > 0 di tabel orders
 * tapi nilai dp tersebut tidak sepenuhnya tercermin di tabel pembayarans,
 * buat record pembayaran "DP Awal" untuk menutup selisihnya.
 *
 * Run: php artisan db:seed --class=FixDpPembayaranSeeder
 */
class FixDpPembayaranSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::with('pembayarans')->where('dp', '>', 0)->get();

        $fixed   = 0;
        $skipped = 0;

        foreach ($orders as $order) {
            // Hitung berapa SEHARUSNYA uang yang sudah masuk berdasarkan sisa bayar
            $truePaid   = (float) ($order->total_harga - $order->sisa_bayar);
            $sumBayar   = (float) $order->pembayarans->sum('jumlah');
            
            // Selisih antara uang yang seharusnya masuk vs yang ada di histori
            $selisih    = round($truePaid - $sumBayar, 2);

            // Jika histori sudah mencakup semua pembayaran, lewati
            if ($selisih <= 0) {
                $skipped++;
                continue;
            }

            // Buat record pembayaran untuk selisihnya (DP Awal yang belum tercatat)
            DB::transaction(function () use ($order, $selisih) {
                Pembayaran::create([
                    'order_id'     => $order->id,
                    'jumlah'       => $selisih,
                    'tanggal'      => $order->tanggal_order,
                    'metode'       => 'transfer',
                    'tipe'         => 'dp',
                    'catatan'      => 'DP Awal (migrasi)',
                    'dicatat_oleh' => $order->created_by ?? 1,
                ]);

                // Sinkronkan field dp agar = sum(pembayarans) setelah insert
                $newSum = (float) $order->pembayarans()->sum('jumlah') + $selisih;
                $order->dp        = $newSum;
                $order->sisa_bayar = max(0, $order->total_harga - $newSum);
                $order->save();
            });

            $this->command->line("✅ {$order->no_order}: +Rp " . number_format($selisih, 0, ',', '.') . " (DP Awal)");
            $fixed++;
        }

        $this->command->info("\nSelesai: {$fixed} order difix, {$skipped} order sudah konsisten.");
    }
}
