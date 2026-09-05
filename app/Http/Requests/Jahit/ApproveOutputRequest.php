<?php

namespace App\Http\Requests\Jahit;

use Illuminate\Foundation\Http\FormRequest;

class ApproveOutputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pcs_approved'   => 'required|integer|min:0',
            'rincian_ukuran' => 'nullable|array',
            'catatan_mandor' => 'nullable|string|max:500',
        ];
    }
}
