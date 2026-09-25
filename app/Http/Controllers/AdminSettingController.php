<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Location;
use App\Models\Shift;
use Illuminate\Support\Facades\DB;

class AdminSettingController extends Controller
{
    /**
     * Tampilkan Halaman Panel Admin
     */
    public function index()
    {
        // Ambil semua tabel master
        $locations = Location::all();
        $shifts = Shift::all();
        
        // Ambil settings (key-value)
        $settings = DB::table('settings')->pluck('setting_value', 'setting_key');

        return Inertia::render('Admin/Settings/Index', [
            'locations' => $locations,
            'shifts' => $shifts,
            'settings' => $settings
        ]);
    }

    /**
     * Tambah/Update Lokasi Baru
     */
    public function storeLocation(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius_meters' => 'required|integer|min:10',
        ]);

        if ($request->id) {
            Location::where('id', $request->id)->update($validated);
            $msg = 'Lokasi berhasil diperbarui.';
        } else {
            Location::create($validated);
            $msg = 'Lokasi baru berhasil ditambahkan.';
        }

        return back()->with('success', $msg);
    }

    /**
     * Hapus Lokasi
     */
    public function destroyLocation($id)
    {
        Location::destroy($id);
        return back()->with('success', 'Lokasi berhasil dihapus.');
    }

    /**
     * Update Pengaturan Global (Lembur, Denda)
     */
    public function updateGlobalSettings(Request $request)
    {
        $settings = $request->except(['_token']);
        
        foreach ($settings as $key => $value) {
            DB::table('settings')->updateOrInsert(
                ['setting_key' => $key],
                ['setting_value' => $value, 'updated_at' => now()]
            );
        }

        return back()->with('success', 'Pengaturan global berhasil disimpan.');
    }
}
