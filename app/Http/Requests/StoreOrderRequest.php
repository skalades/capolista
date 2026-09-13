<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id'       => 'nullable|exists:customers,id',
            'nama_kustomer'     => 'required_without:customer_id|string|max:255',
            'nomor_kontak'      => 'nullable|string|max:255',
            'alamat_pengiriman' => 'nullable|string',
            'items'             => 'required|array|min:1',
            'items.*.jenis_produk' => 'required|string|max:255',
            'items.*.ukuran_detail' => 'nullable|array',
            'items.*.jumlah'    => 'required|integer|min:1',
            'jumlah'            => 'required|integer|min:1',
            'tanggal_order'     => 'required|date',
            'deadline'          => 'required|date|after_or_equal:tanggal_order',
            'total_harga'       => 'required|numeric|min:0',
            'dp'                => 'nullable|numeric|min:0',
            'catatan_desain'    => 'nullable|string',
            'catatan'           => 'nullable|string',
        ];
    }
}
