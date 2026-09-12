<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SPK - {{ $order->no_order }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #333; margin: 0; padding: 0; }
        .top-bar { height: 12px; background-color: #1e3a8a; width: 100%; position: absolute; top: -45px; left: -45px; right: -45px; }
        .container { padding-top: 10px; }
        
        .header { width: 100%; margin-bottom: 20px; }
        .header td { vertical-align: middle; }
        .header-logo { width: 80px; }
        .header-logo img { width: 60px; }
        .header-company { color: #1e3a8a; }
        .header-company h1 { margin: 0; font-size: 22px; font-weight: bold; }
        .header-company p { margin: 3px 0 0 0; color: #777; font-size: 11px; }
        .header-title { text-align: right; font-size: 20px; color: #9ca3af; font-weight: bold; }
        
        .divider { border-bottom: 1px solid #e5e7eb; margin-bottom: 20px; }
        
        .info-box { background-color: #f3f4f6; border-radius: 8px; padding: 15px; margin-bottom: 25px; }
        .info-table { width: 100%; }
        .info-table td { padding: 5px 0; font-size: 13px; }
        .info-table td.label { font-weight: bold; color: #6b7280; width: 20%; }
        .info-table td.value { font-weight: bold; width: 30%; }
        .text-red { color: #ef4444; }
        
        .section-title { color: #1e3a8a; font-size: 14px; font-weight: bold; margin-bottom: 10px; }
        
        .items-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 30px; }
        .items-table th { background-color: #1e3a8a; color: white; padding: 10px; text-align: left; font-size: 12px; }
        .items-table th:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; text-align: center; width: 5%;}
        .items-table th:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; text-align: center; }
        .items-table td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
        .items-table td.center { text-align: center; }
        
        .checklist-wrapper { width: 100%; border-collapse: separate; border-spacing: 10px 0; margin-left: -10px; margin-right: -10px; }
        .checklist-box { border: 1px solid #e5e7eb; border-radius: 8px; vertical-align: top; width: 25%; }
        .checklist-header { background-color: #f3f4f6; text-align: center; font-weight: bold; padding: 8px; font-size: 11px; color: #374151; border-top-left-radius: 8px; border-top-right-radius: 8px; border-bottom: 1px solid #e5e7eb; }
        .checklist-body { padding: 15px 10px; }
        .checklist-row { margin-bottom: 12px; font-size: 11px; color: #6b7280; }
        .checklist-line { display: inline-block; border-bottom: 1px solid #d1d5db; width: 60px; margin-left: 5px; }
        .paraf-text { text-align: center; margin-top: 30px; font-size: 10px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="top-bar"></div>
    
    <div class="container">
        <table class="header">
            <tr>
                @if(\App\Helpers\SettingsHelper::get('company.logo'))
                <td class="header-logo">
                    <img src="{{ public_path('storage/' . \App\Helpers\SettingsHelper::get('company.logo')) }}" alt="Logo">
                </td>
                @endif
                <td class="header-company">
                    <h1>{{ \App\Helpers\SettingsHelper::get('company.name', 'CAPOLISTA APPAREL') }}</h1>
                    <p>{{ \App\Helpers\SettingsHelper::get('company.address', 'Jl. Contoh No. 123, Kota') }}</p>
                </td>
                <td class="header-title">
                    SURAT PERINTAH KERJA (SPK)
                </td>
            </tr>
        </table>
        
        <div class="divider"></div>
        
        <div class="info-box">
            <table class="info-table">
                <tr>
                    <td class="label">Nomor Order:</td>
                    <td class="value">{{ $order->no_order }}</td>
                    <td class="label">Pelanggan:</td>
                    <td class="value">{{ $order->customer->nama ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Deadline:</td>
                    <td class="value text-red">{{ \Carbon\Carbon::parse($order->deadline)->format('d/m/Y') }}</td>
                    <td class="label">Status Order:</td>
                    <td class="value">{{ strtoupper($order->status) }}</td>
                </tr>
            </table>
        </div>
        
        <div class="section-title">Spesifikasi Produk & Breakdown Ukuran</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Jenis Produk</th>
                    <th style="text-align: center;">Ukuran</th>
                    <th style="text-align: center;">Jumlah Pcs</th>
                    <th style="text-align: center;">Ket.</th>
                </tr>
            </thead>
            <tbody>
                @if($order->items && $order->items->count() > 0)
                    @foreach($order->items as $index => $item)
                        <tr>
                            <td class="center">{{ $index + 1 }}</td>
                            <td>{{ $item->jenis_produk ?: $order->jenis_produk }}</td>
                            <td class="center">{{ $item->ukuran ?: 'All' }}</td>
                            <td class="center">{{ $item->jumlah_pcs }}</td>
                            <td class="center">-</td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td class="center">1</td>
                        <td>{{ $order->jenis_produk }}</td>
                        <td class="center">All</td>
                        <td class="center">{{ $order->jumlah }}</td>
                        <td class="center">-</td>
                    </tr>
                @endif
            </tbody>
        </table>
        
        @if($order->catatan || $order->catatan_desain)
        <div style="margin-bottom: 25px;">
            @if($order->catatan)
            <div style="margin-bottom: 10px; font-size: 12px;"><strong>Catatan Umum/Produksi:</strong> {{ $order->catatan }}</div>
            @endif
            @if($order->catatan_desain)
            <div style="font-size: 12px;"><strong>Catatan Desain:</strong> {{ $order->catatan_desain }}</div>
            @endif
        </div>
        @endif
        
        <div class="section-title">Checklist Produksi</div>
        <table class="checklist-wrapper">
            <tr>
                <td class="checklist-box">
                    <div class="checklist-header">CUTTING</div>
                    <div class="checklist-body">
                        <div class="checklist-row">Tgl Mulai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Tgl Selesai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Operator : <span class="checklist-line"></span></div>
                        <div class="paraf-text">Paraf Mandor/QC</div>
                    </div>
                </td>
                <td class="checklist-box">
                    <div class="checklist-header">JAHIT</div>
                    <div class="checklist-body">
                        <div class="checklist-row">Tgl Mulai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Tgl Selesai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Operator : <span class="checklist-line"></span></div>
                        <div class="paraf-text">Paraf Mandor/QC</div>
                    </div>
                </td>
                <td class="checklist-box">
                    <div class="checklist-header">SABLON/PRINTING</div>
                    <div class="checklist-body">
                        <div class="checklist-row">Tgl Mulai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Tgl Selesai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Operator : <span class="checklist-line"></span></div>
                        <div class="paraf-text">Paraf Mandor/QC</div>
                    </div>
                </td>
                <td class="checklist-box">
                    <div class="checklist-header">FINISHING & PACKING</div>
                    <div class="checklist-body">
                        <div class="checklist-row">Tgl Mulai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Tgl Selesai : <span class="checklist-line"></span></div>
                        <div class="checklist-row">Operator : <span class="checklist-line"></span></div>
                        <div class="paraf-text">Paraf Mandor/QC</div>
                    </div>
                </td>
            </tr>
        </table>
        
    </div>
</body>
</html>
