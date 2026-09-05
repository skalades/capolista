<?php

namespace App\Http\Requests\Jahit;

use Illuminate\Foundation\Http\FormRequest;

class AssignOperatorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'operator_id'   => 'required|exists:users,id',
            'jenis_produk'  => 'required|string|max:255',
            'tarif_per_pcs' => 'required|numeric|min:0',
            'catatan'       => 'nullable|string|max:500',
        ];
    }
}
