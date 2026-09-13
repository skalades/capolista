<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Jalan - {{ $order->no_order }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 20px; color: #000; }
        .header-table { width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .logo-text { font-size: 24px; font-weight: bold; margin: 0; }
        .title { font-size: 20px; font-weight: bold; text-align: center; letter-spacing: 2px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { vertical-align: top; padding: 3px; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th, .items-table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .items-table th { background-color: #f4f4f4; text-align: center; }
        .items-table .text-center { text-align: center; }
        
        .sign-table { width: 100%; margin-top: 30px; text-align: center; }
        .sign-table td { width: 33.33%; padding: 10px; }
        .sign-area { height: 80px; }
        .sign-name { font-weight: bold; text-decoration: underline; }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td width="30%">
                <h1 class="logo-text">CAPOLISTA</h1>
                <p style="margin: 0; font-size: 10px;">Apparel & Jersey Printing</p>
            </td>
            <td width="40%" style="text-align: center;">
                <div class="title">SURAT JALAN</div>
                <div>NO: SJ-{{ $order->no_order }}</div>
            </td>
            <td width="30%" style="text-align: right; font-size: 11px;">
                Tanggal: {{ date('d M Y') }}<br/>
            </td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td width="15%"><strong>Penerima</strong></td>
            <td width="2%">:</td>
            <td width="33%">{{ $order->customer->nama ?? '-' }}</td>
            
            <td width="15%"><strong>No. Order</strong></td>
            <td width="2%">:</td>
            <td width="33%">{{ $order->no_order }}</td>
        </tr>
        <tr>
            <td><strong>No. Telp</strong></td>
            <td>:</td>
            <td>{{ $order->customer->kontak ?? '-' }}</td>
            
            <td><strong>Kurir / Supir</strong></td>
            <td>:</td>
            <td>{{ str_replace('Internal - ', '', $order->packing->kurir ?? '-') }}</td>
        </tr>
        <tr>
            <td><strong>Alamat</strong></td>
            <td>:</td>
            <td rowspan="2">{{ $order->customer->alamat ?? '-' }}</td>
            
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="65%">Deskripsi Barang (Jenis Produk)</th>
                <th width="15%">Jumlah</th>
                <th width="15%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">1</td>
                <td>{{ $order->jenis_produk }}</td>
                <td class="text-center">{{ $order->jumlah }} pcs</td>
                <td></td>
            </tr>
            <!-- Untuk loop jika itemsnya banyak, bisa tambahkan di sini -->
        </tbody>
    </table>

    <p style="font-size: 11px; margin-bottom: 5px;"><strong>Catatan Pengiriman:</strong></p>
    <p style="font-size: 11px; margin-top: 0; padding: 10px; border: 1px solid #ccc; min-height: 30px;">
        {{ $order->packing->catatan ?? '-' }}
    </p>

    <table class="sign-table">
        <tr>
            <td>
                Diterima Oleh,<br>(Customer)
                <div class="sign-area"></div>
                <div class="sign-name">( ........................................ )</div>
            </td>
            <td>
                Dibawa Oleh,<br>(Kurir / Supir)
                <div class="sign-area"></div>
                <div class="sign-name">( {{ str_replace('Internal - ', '', $order->packing->kurir ?? '.....................') }} )</div>
            </td>
            <td>
                Diserahkan Oleh,<br>(Gudang Capolista)
                <div class="sign-area"></div>
                <div class="sign-name">( ........................................ )</div>
            </td>
        </tr>
    </table>

</body>
</html>
