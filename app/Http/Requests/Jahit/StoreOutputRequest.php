<?php

namespace App\Http\Requests\Jahit;

use Illuminate\Foundation\Http\FormRequest;

class StoreOutputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assign_id'        => 'required|exists:produksi_jahit_assigns,id',
            'tanggal'          => 'required|date|before_or_equal:today',
            'pcs_klaim'        => 'required|integer|min:1',
            'rincian_ukuran'   => 'nullable|array',
            'catatan_operator' => 'nullable|string|max:500',
        ];
    }
}
