<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DeadlineMendekat extends Notification
{
    use Queueable;

    protected $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Order {$this->order->no_order} mendekati deadline pada " . $this->order->deadline->format('d M Y'),
            'url' => route('orders.show', $this->order->id),
        ];
    }
}
