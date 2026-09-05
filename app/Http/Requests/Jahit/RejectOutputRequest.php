<?php

namespace App\Http\Requests\Jahit;

use Illuminate\Foundation\Http\FormRequest;

class RejectOutputRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'catatan_mandor' => 'required|string|max:500',
        ];
    }
}
