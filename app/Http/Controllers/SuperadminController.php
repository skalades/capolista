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
        $phpVersion = phpversion();
        $laravelVersion = app()->version();
        $diskUsageBytes = disk_free_space('/');
        $diskTotalBytes = disk_total_space('/');
        
        $diskUsage = 0;
        if ($diskTotalBytes > 0) {
            $diskUsage = 100 - round(($diskUsageBytes / $diskTotalBytes) * 100, 2);
        }

        $tables = DB::select('SHOW TABLES');
        $dbName = env('DB_DATABASE');
        $recordCounts = [];

        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            $count = DB::table($tableName)->count();
            $recordCounts[] = [
                'table' => $tableName,
                'count' => $count
            ];
        }

        return Inertia::render('Superadmin/Sistem', [
            'phpVersion' => $phpVersion,
            'laravelVersion' => $laravelVersion,
            'diskUsage' => $diskUsage,
            'recordCounts' => $recordCounts,
        ]);
    }
}
