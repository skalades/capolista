<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::when($request->search, fn($q, $s) =>
            $q->where('nama', 'like', "%{$s}%")
              ->orWhere('kontak', 'like', "%{$s}%")
        )->latest()->paginate(15)->withQueryString();

        return \Inertia\Inertia::render('Customers/Index', [
            'customers' => $query,
            'filters' => $request->only(['search']),
        ]);
    }

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

    public function show(Customer $customer)
    {
        $customer->load(['orders' => function ($q) {
            $q->latest()->take(10);
        }]);
        
        return \Inertia\Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function edit(Customer $customer)
    {
        return \Inertia\Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'alamat' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')->with('success', 'Customer berhasil diperbarui.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->route('customers.index')->with('success', 'Customer berhasil dihapus.');
    }
}
