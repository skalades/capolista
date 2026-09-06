<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class SettingsHelper
{
    public static function get($key, $default = null)
    {
        $setting = DB::table('system_settings')->where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }
}
