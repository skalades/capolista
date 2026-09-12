<?php

namespace App\Http\Requests\Jahit;

use Illuminate\Foundation\Http\FormRequest;

class CompleteJahitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'catatan'     => 'nullable|string|max:500',
        ];
    }
}
