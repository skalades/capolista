<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('jenis_produk');
            $table->string('ukuran')->nullable();
            $table->integer('jumlah_pcs');
            $table->timestamps();
        });

        // Migrate data
        $orders = DB::table('orders')->get();
        foreach ($orders as $order) {
            $ukuranDetails = json_decode($order->ukuran_detail, true);
            
            if (is_array($ukuranDetails) && count($ukuranDetails) > 0) {
                foreach ($ukuranDetails as $ukuran => $jumlah) {
                    if ($jumlah > 0) {
                        DB::table('order_items')->insert([
                            'order_id' => $order->id,
                            'jenis_produk' => $order->jenis_produk,
                            'ukuran' => $ukuran,
                            'jumlah_pcs' => $jumlah,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            } else {
                // If no detail or all 0, create one item
                DB::table('order_items')->insert([
                    'order_id' => $order->id,
                    'jenis_produk' => $order->jenis_produk,
                    'ukuran' => null,
                    'jumlah_pcs' => $order->jumlah,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        // Drop the column after migrating data
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('ukuran_detail');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->json('ukuran_detail')->nullable();
        });
        Schema::dropIfExists('order_items');
    }
};
