<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Dapatkan atau buat customer dummy
        $customer = \App\Models\Customer::firstOrCreate(
            ['email' => 'customer@capolista.com'],
            [
                'nama' => 'Bapak Customer',
                'kontak' => '081234567890',
                'alamat' => 'Jl. Contoh No. 123'
            ]
        );

        // 2. Buat beberapa order dengan status berbeda, khususnya STATUS_JAHIT
        $orders = [
            [
                'no_order' => 'CPL-' . date('Ymd') . '-0001',
                'customer_id' => $customer->id,
                'tanggal_order' => today(),
                'jenis_produk' => 'Jersey Futsal',
                'jumlah' => 20,
                'total_harga' => 3000000,
                'status' => \App\Models\Order::STATUS_JAHIT,
                'deadline' => now()->addDays(7),
                'catatan' => 'Jersey Futsal Tim Elang',
                'items' => [
                    ['ukuran' => 'M', 'jumlah_pcs' => 10],
                    ['ukuran' => 'L', 'jumlah_pcs' => 10],
                ]
            ],
            [
                'no_order' => 'CPL-' . date('Ymd') . '-0002',
                'customer_id' => $customer->id,
                'tanggal_order' => today(),
                'jenis_produk' => 'Kemeja PDL',
                'jumlah' => 30,
                'total_harga' => 4500000,
                'status' => \App\Models\Order::STATUS_JAHIT,
                'deadline' => now()->addDays(14),
                'catatan' => 'Kemeja PDL Lapangan',
                'items' => [
                    ['ukuran' => 'S', 'jumlah_pcs' => 5],
                    ['ukuran' => 'M', 'jumlah_pcs' => 15],
                    ['ukuran' => 'L', 'jumlah_pcs' => 10],
                ]
            ],
            [
                'no_order' => 'CPL-' . date('Ymd') . '-0003',
                'customer_id' => $customer->id,
                'tanggal_order' => today(),
                'jenis_produk' => 'Kaos Event',
                'jumlah' => 50,
                'total_harga' => 2500000,
                'status' => \App\Models\Order::STATUS_CUTTING, // Sedang di cutting, belum masuk jahit
                'deadline' => now()->addDays(5),
                'catatan' => 'Kaos Event Jalan Sehat',
                'items' => [
                    ['ukuran' => 'All Size', 'jumlah_pcs' => 50],
                ]
            ],
        ];

        foreach ($orders as $orderData) {
            $items = $orderData['items'];
            unset($orderData['items']);

            $order = \App\Models\Order::create($orderData);

            // Buat rincian item/ukuran
            foreach ($items as $item) {
                $item['jenis_produk'] = $order->jenis_produk;
                $order->items()->create($item);
            }

            // Tambahkan log
            $order->orderLogs()->create([
                'user_id' => 1, // Superadmin
                'status_lama' => 'new',
                'status_baru' => $orderData['status'],
                'catatan' => 'Order otomatis dibuat dari Seeder'
            ]);
        }
    }
}
