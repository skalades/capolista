<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles & permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // -------------------------------------------------------
        // PERMISSIONS — dikelompokkan per modul
        // -------------------------------------------------------
        $permissions = [
            // Dashboard
            'view dashboard owner',
            'view dashboard admin',
            'view dashboard divisi',

            // User Management
            'manage users',
            'manage roles',
            'view users',

            // Order Management
            'create order',
            'edit order',
            'delete order',
            'view all orders',
            'view own division orders',
            'update order status',

            // Divisi Desain
            'manage desain',
            'upload mockup',
            'approve desain',

            // Divisi Printing
            'manage printing',
            'update printing status',

            // Divisi Pemasangan
            'manage pemasangan',
            'update pemasangan status',

            // Divisi Cutting
            'manage cutting',
            'update cutting status',

            // Divisi Jahit
            'manage jahit',
            'update jahit status',
            'manage tarif borongan',
            'approve jahit output',

            // HR / Personalia
            'manage hr',
            'manage absensi',
            'manage penggajian',
            'approve penggajian',

            // Divisi Produksi (Koordinator)
            'manage produksi',
            'view all production progress',

            // Divisi Gudang
            'manage gudang',
            'manage stok',
            'manage stok opname',
            'manage pengiriman',

            // Divisi Pembelian/Procurement
            'manage procurement',
            'manage suppliers',
            'create purchase order',

            // Divisi Keuangan
            'manage keuangan',
            'view financial reports',
            'create invoice',

            // Laporan
            'view reports',
            'export reports',

            // Notifikasi
            'manage notifications',

            // Superadmin
            'manage system config',
            'manage integrations',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // -------------------------------------------------------
        // ROLES — 6 level sesuai PRD
        // -------------------------------------------------------

        // Level 0: Superadmin — kontrol teknis penuh
        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $superadmin->givePermissionTo(Permission::all());

        // Level 1: Owner — visibilitas penuh bisnis
        $owner = Role::firstOrCreate(['name' => 'owner']);
        $owner->givePermissionTo([
            'view dashboard owner',
            'view all orders',
            'view all production progress',
            'view reports',
            'export reports',
            'view financial reports',
            'view users',
            'approve desain',
        ]);

        // Level 2: Admin/Manajer Operasional
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'view dashboard admin',
            'create order',
            'edit order',
            'delete order',
            'view all orders',
            'update order status',
            'manage users',
            'view all production progress',
            'view reports',
            'export reports',
            'approve desain',
            'manage notifications',
        ]);

        // Level 3: Kepala Divisi (satu role, akses disesuaikan per divisi)
        $kepalaDivisi = Role::firstOrCreate(['name' => 'kepala divisi']);
        $kepalaDivisi->givePermissionTo([
            'view dashboard divisi',
            'view own division orders',
            'update order status',
            'manage desain',
            'approve desain',
            'manage printing',
            'manage pemasangan',
            'manage cutting',
            'manage jahit',
            'manage tarif borongan',
            'approve jahit output',
            'manage hr',
            'manage absensi',
            'manage penggajian',
            'approve penggajian',
            'manage produksi',
            'manage gudang',
            'manage stok',
            'manage stok opname',
            'manage pengiriman',
            'manage procurement',
            'manage suppliers',
            'create purchase order',
            'manage keuangan',
            'view financial reports',
            'create invoice',
        ]);

        // Level 4: Staf/Operator Divisi
        $staf = Role::firstOrCreate(['name' => 'staf']);
        $staf->givePermissionTo([
            'view dashboard divisi',
            'view own division orders',
            'update order status',
            'upload mockup',
            'update printing status',
            'update pemasangan status',
            'update cutting status',
            'update jahit status',
            'manage stok opname',
        ]);

        // Level 5: Customer (read-only, opsional fase 2)
        $customer = Role::firstOrCreate(['name' => 'customer']);
        $customer->givePermissionTo([
            'view own division orders',
        ]);

        // DEFAULT SUPERADMIN USER
        $superadminUser = User::firstOrCreate(
            ['email' => 'superadmin@capolista.com'],
            [
                'name'        => 'Superadmin',
                'password'    => Hash::make('capolista@2024'),
                'level_akses' => User::LEVEL_SUPERADMIN,
                'divisi'      => null,
                'is_active'   => true,
            ]
        );
        $superadminUser->assignRole('superadmin');

        // DEFAULT OWNER USER
        $ownerUser = User::firstOrCreate(
            ['email' => 'owner@capolista.com'],
            [
                'name'        => 'Owner Capolista',
                'password'    => Hash::make('capolista@2024'),
                'level_akses' => User::LEVEL_OWNER,
                'divisi'      => null,
                'is_active'   => true,
            ]
        );
        $ownerUser->assignRole('owner');

        // DEFAULT ADMIN USER
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@capolista.com'],
            [
                'name'        => 'Admin Operasional',
                'password'    => Hash::make('capolista@2024'),
                'level_akses' => User::LEVEL_ADMIN,
                'divisi'      => null,
                'is_active'   => true,
            ]
        );
        $adminUser->assignRole('admin');

        // SEEDER KEPALA DIVISI & STAF UNTUK SETIAP DIVISI
        $outputUsers = [
            ['superadmin@capolista.com', 'superadmin', 'capolista@2024', '-'],
            ['owner@capolista.com',      'owner',      'capolista@2024', '-'],
            ['admin@capolista.com',      'admin',      'capolista@2024', '-'],
        ];

        foreach (User::DIVISI_LIST as $key => $label) {
            // Kepala Divisi
            $kepala = User::firstOrCreate(
                ['email' => "kepala.{$key}@capolista.com"],
                [
                    'name'        => "Kepala Divisi {$label}",
                    'password'    => Hash::make('capolista@2024'),
                    'level_akses' => User::LEVEL_KEPALA_DIVISI,
                    'divisi'      => $key,
                    'is_active'   => true,
                ]
            );
            $kepala->assignRole('kepala divisi');
            $outputUsers[] = [$kepala->email, 'kepala divisi', 'capolista@2024', $key];

            // Staf
            $staf = User::firstOrCreate(
                ['email' => "staf.{$key}@capolista.com"],
                [
                    'name'        => "Staf {$label}",
                    'password'    => Hash::make('capolista@2024'),
                    'level_akses' => User::LEVEL_STAF,
                    'divisi'      => $key,
                    'is_active'   => true,
                ]
            );
            $staf->assignRole('staf');
            $outputUsers[] = [$staf->email, 'staf', 'capolista@2024', $key];
        }

        // DEFAULT CUSTOMER (Opsional login)
        $customerUser = User::firstOrCreate(
            ['email' => 'customer@capolista.com'],
            [
                'name'        => 'Customer Testing',
                'password'    => Hash::make('capolista@2024'),
                'level_akses' => User::LEVEL_CUSTOMER,
                'divisi'      => null,
                'is_active'   => true,
            ]
        );
        $customerUser->assignRole('customer');
        $outputUsers[] = [$customerUser->email, 'customer', 'capolista@2024', '-'];

        $this->command->info('✅ Roles, permissions, dan default users berhasil dibuat!');
        $this->command->table(
            ['Email', 'Role', 'Password', 'Divisi'],
            $outputUsers
        );
    }
}
