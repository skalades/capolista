<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
// use App\Models\Order; // TODO: Uncomment setelah ada model Order
use App\Notifications\DeadlineWarningNotification;
use Illuminate\Support\Facades\Notification;

class CheckOrderDeadlines extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-order-deadlines';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengecek order yang mendekati deadline (H-3) dan mengirimkan notifikasi';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $targetDate = now()->addDays(3)->toDateString();
        
        // --- TODO: Hapus komentar ini jika Model Order sudah dibuat ---
        // $orders = Order::whereDate('deadline', $targetDate)
        //                ->whereNotIn('status', ['selesai', 'siap_kirim'])
        //                ->get();
                       
        // if ($orders->isEmpty()) {
        //     $this->info("Tidak ada order yang mendekati deadline H-3 hari ini.");
        //     return;
        // }

        // $usersToNotify = User::whereIn('role', ['admin', 'owner'])->get();
        
        // foreach ($orders as $order) {
        //     Notification::send($usersToNotify, new DeadlineWarningNotification($order));
        // }

        // $this->info("Pengecekan selesai. Ditemukan {$orders->count()} pesanan mendekati H-3.");
        // --------------------------------------------------------------

        $this->info("Pengecekan deadline dijalankan. (Logika masih dicomment karena model Order belum di-implementasikan).");
    }
}
