<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Label Pengiriman - {{ $order->no_order }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 10px; color: #000; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 10px; }
        .logo-text { font-size: 18px; font-weight: bold; margin: 0; }
        .sub-header { font-size: 10px; margin: 0; }
        .section { margin-bottom: 15px; }
        .section-title { font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 5px; font-size: 11px; }
        .info-box { border: 1px solid #000; padding: 10px; border-radius: 5px; }
        .recipient-name { font-size: 16px; font-weight: bold; margin: 0 0 5px 0; }
        .barcode { text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000; }
        .order-no { font-size: 14px; font-weight: bold; letter-spacing: 2px; }
        .items { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 10px; }
        .items th, .items td { border: 1px solid #ddd; padding: 3px; text-align: left; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="logo-text">CAPOLISTA</h1>
        <p class="sub-header">Apparel & Jersey Printing</p>
    </div>

    <div class="section info-box">
        <div class="section-title">PENERIMA:</div>
        <h2 class="recipient-name">{{ $order->customer->nama ?? 'No Name' }}</h2>
        <p style="margin: 0;"><strong>Telp:</strong> {{ $order->customer->kontak ?? '-' }}</p>
        <p style="margin: 5px 0 0 0; line-height: 1.4;"><strong>Alamat:</strong><br/>
           {{ $order->customer->alamat ?? '-' }}
        </p>
    </div>

    <div class="section">
        <div class="section-title">PENGIRIM:</div>
        <p style="margin: 0;"><strong>CAPOLISTA</strong><br/>Telp: 0812-XXXX-XXXX<br/>Alamat Workshop Capolista</p>
    </div>

    <div class="section">
        <div class="section-title">RINCIAN PESANAN:</div>
        <table class="items">
            <tr>
                <th width="70%">Produk</th>
                <th>Qty</th>
            </tr>
            <tr>
                <td>{{ $order->jenis_produk }}</td>
                <td style="text-align: center;">{{ $order->jumlah }}</td>
            </tr>
        </table>
        <p style="font-size: 9px; margin-top: 5px;">Kurir: {{ $order->packing->kurir ?? '-' }}</p>
    </div>

    <div class="barcode">
        <p style="margin: 0; font-size: 10px;">NO ORDER:</p>
        <div class="order-no">{{ $order->no_order }}</div>
    </div>

</body>
</html>
