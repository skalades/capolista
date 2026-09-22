<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id'    => 'required|exists:customers,id',
            'items'          => 'required|array|min:1',
            'items.*.jenis_produk' => 'required|string|max:255',
            'items.*.ukuran_detail' => 'nullable|array',
            'items.*.jumlah'    => 'required|integer|min:1',
            'items.*.harga_satuan' => 'nullable|numeric|min:0',
            'jumlah'         => 'required|integer|min:1',
            'tanggal_order'  => 'required|date',
            'deadline'       => 'required|date',
            'total_harga'    => 'required|numeric|min:0',
            'dp'             => 'nullable|numeric|min:0',
            'catatan_desain' => 'nullable|string',
            'catatan'        => 'nullable|string',
        ];
    }
}
