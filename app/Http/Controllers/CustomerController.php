<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        Customer::create($validated);

        return back()->with('success', 'Customer berhasil ditambahkan.');
    }
}
