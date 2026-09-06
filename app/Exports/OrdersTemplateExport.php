<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class OrdersTemplateExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
{
    public function headings(): array
    {
        return [
            'AWAL PEMESANAN',
            'NO RESI',
            'CUSTOMER/CLIENT',
            'BAHAN',
            'JENIS ORDER',
            'TENGGAT WAKTU',
            'QTY',
            'AKHIR PEMESANAN',
            'PRINT',
            'PRES',
            'JAHIT',
            'PENJAHIT',
            'KATEGORI',
            'HARGA SATUAN',
            'JUMLAH Rp',
            'DP 1',
            'DP 2',
            'DP 3',
            'DP 4',
            'DP 5',
            'PELUNASAN',
            'TOTAL BAYAR BULAN INI',
            'TOTAL KESELURUHAN',
            'SISA',
            'KET.',
        ];
    }

    public function array(): array
    {
        return [
            [
                '2026-09-02',      // AWAL PEMESANAN
                'INV-12345',       // NO RESI
                'CIPICUNG FC',     // CUSTOMER/CLIENT
                'MILANO',          // BAHAN
                'J. PRINT',        // JENIS ORDER
                '2 MINGGU',        // TENGGAT WAKTU
                '18',              // QTY
                '2026-09-16',      // AKHIR PEMESANAN
                '',                // PRINT
                '',                // PRES
                '',                // JAHIT
                'Budi',            // PENJAHIT
                'Tim Lokal',       // KATEGORI
                '135000',          // HARGA SATUAN
                '2430000',         // JUMLAH Rp
                '1640000',         // DP 1
                '0',               // DP 2
                '0',               // DP 3
                '0',               // DP 4
                '0',               // DP 5
                '0',               // PELUNASAN
                '1640000',         // TOTAL BAYAR BULAN INI
                '1640000',         // TOTAL KESELURUHAN
                '790000',          // SISA
                '',                // KET.
            ],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'color' => ['rgb' => '4F46E5']]],
        ];
    }
}
