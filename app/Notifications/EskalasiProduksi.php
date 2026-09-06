<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class EskalasiProduksi extends Notification
{
    use Queueable;

    public function __construct(
        protected $order,
        protected string $catatan,
        protected string $dikirimOleh,
        protected int $hariDiStatus
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'eskalasi_produksi',
            'order_id'       => $this->order->id,
            'no_order'       => $this->order->no_order,
            'status'         => $this->order->status,
            'hari_di_status' => $this->hariDiStatus,
            'catatan'        => $this->catatan,
            'dikirim_oleh'   => $this->dikirimOleh,
            'message'        => "⚠️ Eskalasi: Order #{$this->order->no_order} sudah {$this->hariDiStatus} hari di status {$this->order->status}. {$this->catatan}",
            'url'            => route('orders.show', $this->order->id),
        ];
    }
}
