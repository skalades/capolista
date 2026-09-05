<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OrderLog;
use App\Models\Pemasangan;
use App\Models\Printing;
use App\Models\ProduksiJahitAssign;
use App\Models\ProduksiJahitOutput;
use App\Models\TarifBoronganHistory;
use Illuminate\Support\Facades\DB;
use Exception;

class JahitService
{
    /**
     * Assign operator ke order dengan tarif borongan.
     */
    public function assignOperator(Order $order, array $data, int $userId): void
    {
        if ($order->status !== Order::STATUS_JAHIT) {
            throw new Exception('Order tidak dalam status Jahit.');
        }

        DB::transaction(function () use ($data, $order, $userId) {
            $existing = ProduksiJahitAssign::where('order_id', $order->id)
                ->where('operator_id', $data['operator_id'])
                ->where('jenis_produk', $data['jenis_produk'])
                ->first();

            if ($existing) {
                if ((float) $existing->tarif_per_pcs !== (float) $data['tarif_per_pcs']) {
                    TarifBoronganHistory::create([
                        'assign_id'          => $existing->id,
                        'operator_id'        => $existing->operator_id,
                        'order_id'           => $order->id,
                        'jenis_produk'       => $existing->jenis_produk,
                        'tarif_per_pcs_lama' => $existing->tarif_per_pcs,
                        'tarif_per_pcs_baru' => $data['tarif_per_pcs'],
                        'berlaku_mulai'      => now(),
                        'diubah_oleh'        => $userId,
                        'alasan'             => 'Update tarif oleh mandor',
                    ]);

                    $existing->update([
                        'tarif_per_pcs' => $data['tarif_per_pcs'],
                        'catatan'       => $data['catatan'] ?? $existing->catatan,
                        'is_active'     => true,
                    ]);
                }
            } else {
                ProduksiJahitAssign::create([
                    'order_id'      => $order->id,
                    'operator_id'   => $data['operator_id'],
                    'jenis_produk'  => $data['jenis_produk'],
                    'tarif_per_pcs' => $data['tarif_per_pcs'],
                    'tanggal_assign' => today(),
                    'dibuat_oleh'   => $userId,
                    'is_active'     => true,
                    'catatan'       => $data['catatan'] ?? null,
                ]);
            }
        });
    }

    /**
     * Submit output harian (self-report).
     */
    public function submitOutput(array $data, int $operatorId): void
    {
        $assign = ProduksiJahitAssign::findOrFail($data['assign_id']);

        if ($assign->operator_id !== $operatorId) {
            throw new Exception('Anda tidak berhak submit output untuk assign ini.');
        }

        DB::transaction(function () use ($data, $assign, $operatorId) {
            $payload = [
                'assign_id'              => $assign->id,
                'operator_id'            => $operatorId,
                'order_id'               => $assign->order_id,
                'jenis_produk'           => $assign->jenis_produk,
                'tanggal'                => $data['tanggal'],
                'pcs_klaim'              => $data['pcs_klaim'],
                'rincian_ukuran'         => $data['rincian_ukuran'] ?? null,
                'pcs_approved'           => null,
                'tarif_per_pcs_snapshot' => $assign->tarif_per_pcs,
                'upah_kotor'             => 0,
                'status'                 => ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL,
                'catatan_operator'       => $data['catatan_operator'] ?? null,
                'catatan_mandor'         => null,
                'approved_by'            => null,
                'approved_at'            => null,
            ];

            ProduksiJahitOutput::create($payload);
        });
    }

    /**
     * Approve output.
     */
    public function approveOutput(ProduksiJahitOutput $output, array $data, int $mandorId): float
    {
        if ($output->status !== ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL) {
            throw new Exception('Output tidak dalam status menunggu approval.');
        }

        $pcsApproved = (int) $data['pcs_approved'];

        if ($pcsApproved > $output->pcs_klaim) {
            throw new Exception('Pcs approved tidak boleh melebihi pcs klaim.');
        }

        $upah = $pcsApproved * (float) $output->tarif_per_pcs_snapshot;

        $output->update([
            'pcs_approved'   => $pcsApproved,
            'rincian_ukuran' => $data['rincian_ukuran'] ?? $output->rincian_ukuran,
            'upah_kotor'     => $upah,
            'status'         => ProduksiJahitOutput::STATUS_APPROVED,
            'approved_by'    => $mandorId,
            'approved_at'    => now(),
            'catatan_mandor' => $data['catatan_mandor'] ?? null,
        ]);

        return $upah;
    }

    /**
     * Reject output.
     */
    public function rejectOutput(ProduksiJahitOutput $output, array $data, int $mandorId): void
    {
        if ($output->status !== ProduksiJahitOutput::STATUS_MENUNGGU_APPROVAL) {
            throw new Exception('Output tidak dalam status menunggu approval.');
        }

        $output->update([
            'status'         => ProduksiJahitOutput::STATUS_REJECTED,
            'catatan_mandor' => $data['catatan_mandor'],
            'approved_by'    => $mandorId,
            'approved_at'    => now(),
        ]);
    }

    /**
     * Selesaikan order jahit.
     */
    public function completeOrder(Order $order, array $data, int $userId): string
    {
        if ($order->status !== Order::STATUS_JAHIT) {
            throw new Exception('Order tidak dalam status Jahit.');
        }

        $nextStatus = $data['next_divisi'] === 'printing'
            ? Order::STATUS_PRINTING
            : Order::STATUS_PEMASANGAN;

        DB::transaction(function () use ($order, $nextStatus, $data, $userId) {
            $order->update(['status' => $nextStatus]);

            OrderLog::create([
                'order_id'    => $order->id,
                'user_id'     => $userId,
                'status_lama' => Order::STATUS_JAHIT,
                'status_baru' => $nextStatus,
                'catatan'     => $data['catatan'] ?? 'Selesai jahit.',
            ]);

            if ($nextStatus === Order::STATUS_PRINTING && !$order->printing) {
                Printing::create(['order_id' => $order->id, 'status' => 'menunggu']);
            }

            if ($nextStatus === Order::STATUS_PEMASANGAN && !$order->pemasangan) {
                Pemasangan::create(['order_id' => $order->id, 'status' => 'menunggu']);
            }
        });

        return ucfirst($data['next_divisi']);
    }
}
