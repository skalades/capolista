<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles')
            ->when($request->search, fn($q, $s) =>
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
            )
            ->when($request->role, fn($q, $r) =>
                $q->whereHas('roles', fn($q2) => $q2->where('name', $r))
            )
            ->when($request->divisi, fn($q, $d) => $q->where('divisi', $d))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Users/Index', [
            'users'      => $query,
            'roles'      => Role::orderBy('name')->get(),
            'divisiList' => User::DIVISI_LIST,
            'filters'    => $request->only(['search', 'role', 'divisi']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles'      => Role::orderBy('name')->get(),
            'divisiList' => User::DIVISI_LIST,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:8|confirmed',
            'role'          => 'required|string|exists:roles,name',
            'divisi'        => 'nullable|string',
            'level_akses'   => 'required|integer|between:0,5',
            'is_active'     => 'boolean',
            'nik'           => 'nullable|string|max:255',
            'jabatan'       => 'nullable|string|max:255',
            'tanggal_masuk' => 'nullable|date',
            'tipe_gaji'     => 'nullable|in:borongan,harian,bulanan',
            'tarif_default' => 'nullable|numeric|min:0',
            'tarif_lembur'  => 'nullable|numeric|min:0',
            'no_hp'         => 'nullable|string|max:255',
            'alamat'        => 'nullable|string',
            'mesin_pos'     => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'password'      => Hash::make($validated['password']),
            'level_akses'   => $validated['level_akses'],
            'divisi'        => $validated['divisi'] ?? null,
            'is_active'     => $validated['is_active'] ?? true,
            'nik'           => $validated['nik'] ?? null,
            'jabatan'       => $validated['jabatan'] ?? null,
            'tanggal_masuk' => $validated['tanggal_masuk'] ?? null,
            'tipe_gaji'     => $validated['tipe_gaji'] ?? null,
            'tarif_default' => $validated['tarif_default'] ?? null,
            'tarif_lembur'  => $validated['tarif_lembur'] ?? null,
            'no_hp'         => $validated['no_hp'] ?? null,
            'alamat'        => $validated['alamat'] ?? null,
            'mesin_pos'     => $validated['mesin_pos'] ?? null,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->route('users.index')
            ->with('success', "Pengguna {$user->name} berhasil ditambahkan.");
    }

    public function edit(User $user)
    {
        $user->load('roles');
        return Inertia::render('Users/Edit', [
            'user'       => array_merge($user->toArray(), ['role' => $user->roles->first()?->name]),
            'roles'      => Role::orderBy('name')->get(),
            'divisiList' => User::DIVISI_LIST,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => "required|email|unique:users,email,{$user->id}",
            'role'          => 'required|string|exists:roles,name',
            'divisi'        => 'nullable|string',
            'level_akses'   => 'required|integer|between:0,5',
            'is_active'     => 'boolean',
            'nik'           => 'nullable|string|max:255',
            'jabatan'       => 'nullable|string|max:255',
            'tanggal_masuk' => 'nullable|date',
            'tipe_gaji'     => 'nullable|in:borongan,harian,bulanan',
            'tarif_default' => 'nullable|numeric|min:0',
            'tarif_lembur'  => 'nullable|numeric|min:0',
            'no_hp'         => 'nullable|string|max:255',
            'alamat'        => 'nullable|string',
            'mesin_pos'     => 'nullable|string|max:255',
        ]);

        $user->update([
            'name'          => $validated['name'],
            'email'         => $validated['email'],
            'level_akses'   => $validated['level_akses'],
            'divisi'        => $validated['divisi'] ?? null,
            'is_active'     => $validated['is_active'] ?? $user->is_active,
            'nik'           => $validated['nik'] ?? null,
            'jabatan'       => $validated['jabatan'] ?? null,
            'tanggal_masuk' => $validated['tanggal_masuk'] ?? null,
            'tipe_gaji'     => $validated['tipe_gaji'] ?? null,
            'tarif_default' => $validated['tarif_default'] ?? null,
            'tarif_lembur'  => $validated['tarif_lembur'] ?? null,
            'no_hp'         => $validated['no_hp'] ?? null,
            'alamat'        => $validated['alamat'] ?? null,
            'mesin_pos'     => $validated['mesin_pos'] ?? null,
        ]);

        $user->syncRoles([$validated['role']]);

        return redirect()->route('users.index')
            ->with('success', "Pengguna {$user->name} berhasil diperbarui.");
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak bisa menghapus akun sendiri.');
        }
        $user->delete();
        return redirect()->route('users.index')
            ->with('success', "Pengguna {$user->name} berhasil dihapus.");
    }

    public function toggleActive(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Tidak bisa menonaktifkan akun sendiri.');
        }
        $user->update(['is_active' => !$user->is_active]);
        $status = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Akun {$user->name} berhasil {$status}.");
    }

    public function resetPassword(Request $request, User $user)
    {
        $request->validate(['password' => 'required|string|min:8|confirmed']);
        $user->update(['password' => Hash::make($request->password)]);
        return back()->with('success', "Password {$user->name} berhasil direset.");
    }
}
