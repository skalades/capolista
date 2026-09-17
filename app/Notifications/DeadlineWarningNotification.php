<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeadlineWarningNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $order;

    /**
     * Create a new notification instance.
     */
    public function __construct($order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Menyimpan notifikasi di database untuk ditampilkan di in-app notification
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id ?? null,
            'no_order' => $this->order->no_order ?? 'Unknown',
            'message' => 'Pesanan dengan nomor ' . ($this->order->no_order ?? 'Unknown') . ' akan memasuki deadline dalam 3 hari.',
            'type' => 'warning_deadline'
        ];
    }
}
