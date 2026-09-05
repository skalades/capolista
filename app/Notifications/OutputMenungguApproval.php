<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OutputMenungguApproval extends Notification
{
    use Queueable;

    protected $output;
    protected $order;

    public function __construct($output, $order)
    {
        $this->output = $output;
        $this->order = $order;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Output jahit baru untuk order {$this->order->no_order} menunggu approval.",
            'url' => route('jahit.show', $this->order->id),
        ];
    }
}
