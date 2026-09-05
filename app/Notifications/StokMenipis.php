<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class StokMenipis extends Notification
{
    use Queueable;

    protected $bahan;

    public function __construct($bahan)
    {
        $this->bahan = $bahan;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => "Stok bahan {$this->bahan->nama_bahan} menipis ({$this->bahan->stok} {$this->bahan->satuan}). Segera lakukan restock.",
            'url' => route('gudang.stok'),
        ];
    }
}
