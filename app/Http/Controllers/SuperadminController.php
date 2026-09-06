<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class SuperadminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $totalRoles = Role::count();
        $totalDivisi = count(User::DIVISI_LIST);

        return Inertia::render('Superadmin/Index', [
            'totalUsers' => $totalUsers,
            'activeUsers' => $activeUsers,
            'totalRoles' => $totalRoles,
            'totalDivisi' => $totalDivisi,
        ]);
    }

    public function roleIndex()
    {
        $roles = Role::all();
        return Inertia::render('Superadmin/Roles', [
            'roles' => $roles
        ]);
    }

    public function roleStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        Role::create(['name' => $request->name]);

        return redirect()->back()->with('success', 'Role berhasil ditambahkan.');
    }

    public function roleUpdate(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update(['name' => $request->name]);

        return redirect()->back()->with('success', 'Role berhasil diupdate.');
    }

    public function roleDestroy(Role $role)
    {
        $role->delete();

        return redirect()->back()->with('success', 'Role berhasil dihapus.');
    }

    public function sistemInfo()
    {
        $phpVersion    = phpversion();
        $laravelVersion = app()->version();
        $diskFreeBytes = disk_free_space(storage_path());
        $diskTotalBytes = disk_total_space(storage_path());

        $diskUsage = 0;
        if ($diskTotalBytes > 0) {
            $diskUsage = 100 - round(($diskFreeBytes / $diskTotalBytes) * 100, 2);
        }

        // Database-agnostic: compatible dengan SQLite, MySQL, PostgreSQL
        $tables = \Illuminate\Support\Facades\Schema::getTableListing();
        $recordCounts = [];

        foreach ($tables as $tableName) {
            try {
                $count = \Illuminate\Support\Facades\DB::table($tableName)->count();
                $recordCounts[] = [
                    'table' => $tableName,
                    'count' => $count,
                ];
            } catch (\Exception $e) {
                $recordCounts[] = [
                    'table' => $tableName,
                    'count' => 'Error',
                ];
            }
        }

        // Sort by table name
        usort($recordCounts, fn ($a, $b) => strcmp($a['table'], $b['table']));

        return Inertia::render('Superadmin/Sistem', [
            'phpVersion'    => $phpVersion,
            'laravelVersion' => $laravelVersion,
            'diskUsage'     => $diskUsage,
            'diskFreeGB'    => round($diskFreeBytes / 1024 / 1024 / 1024, 2),
            'diskTotalGB'   => round($diskTotalBytes / 1024 / 1024 / 1024, 2),
            'recordCounts'  => $recordCounts,
        ]);
    }

    public function settingsIndex()
    {
        $settings = DB::table('system_settings')->get();
        return Inertia::render('Superadmin/Settings', [
            'settings' => $settings
        ]);
    }

    public function settingsUpdate(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'required|string',
        ]);

        foreach ($data['settings'] as $index => $setting) {
            $value = $setting['value'];

            if ($setting['type'] === 'image' && $request->hasFile("settings.$index.value")) {
                $file = $request->file("settings.$index.value");
                $path = $file->store('settings', 'public');
                $value = $path;
            }

            DB::table('system_settings')
                ->where('key', $setting['key'])
                ->update([
                    'value' => $value,
                    'updated_at' => now(),
                    'updated_by' => auth()->id(),
                ]);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
