<?php

namespace App\Services;

use App\Helpers\OrderHelper;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderLog;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new order.
     */
    public function createOrder(array $data, int $userId): Order
    {
        return DB::transaction(function () use ($data, $userId) {
            $customerId = $this->resolveCustomerId($data);
            
            $dp = $data['dp'] ?? 0;
            $jenisProdukMaster = collect($data['items'])->pluck('jenis_produk')->unique()->implode(', ');

            $order = Order::create([
                'customer_id'    => $customerId,
                'jenis_produk'   => $jenisProdukMaster,
                'jumlah'         => $data['jumlah'],
                'tanggal_order'  => $data['tanggal_order'],
                'deadline'       => $data['deadline'],
                'total_harga'    => $data['total_harga'],
                'catatan_desain' => $data['catatan_desain'] ?? null,
                'catatan'        => $data['catatan'] ?? null,
                'no_order'       => OrderHelper::generateNoOrder(),
                'status'         => Order::STATUS_DRAFT,
                'dp'             => $dp,
                'sisa_bayar'     => $data['total_harga'] - $dp,
                'created_by'     => $userId,
            ]);

            $this->createOrderItems($order, $data['items']);

            OrderLog::create([
                'order_id'   => $order->id,
                'user_id'    => $userId,
                'status_lama'=> null,
                'status_baru'=> Order::STATUS_DRAFT,
                'catatan'    => 'Order dibuat',
            ]);

            return $order;
        });
    }

    /**
     * Update an existing order.
     */
    public function updateOrder(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $dp = $data['dp'] ?? 0;
            $jenisProdukMaster = collect($data['items'])->pluck('jenis_produk')->unique()->implode(', ');

            $order->update([
                'customer_id'    => $data['customer_id'],
                'jenis_produk'   => $jenisProdukMaster,
                'jumlah'         => $data['jumlah'],
                'tanggal_order'  => $data['tanggal_order'],
                'deadline'       => $data['deadline'],
                'total_harga'    => $data['total_harga'],
                'catatan_desain' => $data['catatan_desain'] ?? null,
                'catatan'        => $data['catatan'] ?? null,
                'dp'             => $dp,
                'sisa_bayar'     => $data['total_harga'] - $dp,
            ]);

            $order->items()->delete();
            $this->createOrderItems($order, $data['items']);

            return $order;
        });
    }

    /**
     * Resolve Customer ID (Create if not exists).
     */
    private function resolveCustomerId(array $data): int
    {
        if (!empty($data['customer_id'])) {
            return $data['customer_id'];
        }

        $customer = Customer::where('nama', $data['nama_kustomer'])->first();
        
        if ($customer) {
            $needsUpdate = false;
            if (empty($customer->kontak) && !empty($data['nomor_kontak'])) {
                $customer->kontak = $data['nomor_kontak'];
                $needsUpdate = true;
            }
            if (empty($customer->alamat) && !empty($data['alamat_pengiriman'])) {
                $customer->alamat = $data['alamat_pengiriman'];
                $needsUpdate = true;
            }
            if ($needsUpdate) {
                $customer->save();
            }
            return $customer->id;
        }

        $customer = Customer::create([
            'nama'   => $data['nama_kustomer'],
            'kontak' => $data['nomor_kontak'] ?? '',
            'alamat' => $data['alamat_pengiriman'] ?? '',
        ]);

        return $customer->id;
    }

    /**
     * Create Order Items logic.
     */
    private function createOrderItems(Order $order, array $items): void
    {
        foreach ($items as $itemData) {
            $hargaSatuan = isset($itemData['harga_satuan']) ? str_replace(['Rp', '.', ' '], '', $itemData['harga_satuan']) : null;
            
            if (!empty($itemData['ukuran_detail'])) {
                $hasSizes = false;
                foreach ($itemData['ukuran_detail'] as $ukuran => $jumlah) {
                    if ($jumlah > 0) {
                        $order->items()->create([
                            'jenis_produk' => $itemData['jenis_produk'],
                            'ukuran' => $ukuran,
                            'jumlah_pcs' => $jumlah,
                            'harga_satuan' => $hargaSatuan,
                        ]);
                        $hasSizes = true;
                    }
                }
                if (!$hasSizes) {
                    $order->items()->create([
                        'jenis_produk' => $itemData['jenis_produk'],
                        'ukuran' => null,
                        'jumlah_pcs' => $itemData['jumlah'],
                        'harga_satuan' => $hargaSatuan,
                    ]);
                }
            } else {
                $order->items()->create([
                    'jenis_produk' => $itemData['jenis_produk'],
                    'ukuran' => null,
                    'jumlah_pcs' => $itemData['jumlah'],
                    'harga_satuan' => $hargaSatuan,
                ]);
            }
        }
    }
}
