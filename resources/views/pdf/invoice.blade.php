<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>INVOICE - {{ $order->no_order }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { display: table; width: 100%; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header-left { display: table-cell; width: 50%; vertical-align: top; }
        .header-right { display: table-cell; width: 50%; text-align: right; vertical-align: top; }
        .header h1 { margin: 0; font-size: 28px; color: #333; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .info-box { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; background-color: #f9f9f9; }
        .info-table { width: 100%; }
        .info-table td { padding: 3px; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; }
        .details-table th { background-color: #f2f2f2; text-align: center; }
        .totals-table { width: 40%; float: right; margin-top: 20px; border-collapse: collapse; }
        .totals-table td { padding: 5px; }
        .totals-table .amount { text-align: right; font-weight: bold; }
        .clearfix { clear: both; }
        .footer { margin-top: 50px; font-size: 12px; color: #555; text-align: center; border-top: 1px solid #ddd; padding-top: 10px; }
        .signature-box { width: 30%; float: right; text-align: center; margin-top: 30px; }
        .signature-line { border-bottom: 1px solid #000; margin-top: 60px; width: 100%; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <div class="company-name">CAPOLISTA</div>
            <p style="margin:0;">Jl. Contoh Alamat No. 123<br>Kota, Provinsi, 12345<br>Telp: 0812-3456-7890</p>
        </div>
        <div class="header-right">
            <h1>INVOICE</h1>
            <p>No: <strong>{{ $order->no_order }}</strong><br>Tanggal: {{ date('d M Y') }}</p>
        </div>
    </div>

    <div class="info-box">
        <table class="info-table">
            <tr>
                <td style="width:100px;"><strong>Kepada:</strong></td>
                <td>{{ $order->customer->nama ?? '-' }}</td>
            </tr>
            <tr>
                <td><strong>Kontak:</strong></td>
                <td>{{ $order->customer->kontak ?? '-' }}</td>
            </tr>
            <tr>
                <td><strong>Alamat:</strong></td>
                <td>{{ $order->customer->alamat ?? '-' }}</td>
            </tr>
        </table>
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Deskripsi Produk</th>
                <th>Jumlah</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center;">1</td>
                <td>
                    <strong>{{ $order->jenis_produk }}</strong><br>
                    <small>
                    @if($order->ukuran_detail)
                        @foreach($order->ukuran_detail as $k => $v)
                            {{ ucfirst($k) }}: {{ $v }} | 
                        @endforeach
                    @endif
                    </small>
                </td>
                <td style="text-align: center;">{{ $order->jumlah }}</td>
                <td style="text-align: right;">Rp {{ number_format($order->total_harga, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <table class="totals-table">
        <tr>
            <td>Total</td>
            <td class="amount">Rp {{ number_format($order->total_harga, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td>Uang Muka (DP)</td>
            <td class="amount">Rp {{ number_format($order->dp, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td style="border-top: 2px solid #000;"><strong>Sisa Tagihan</strong></td>
            <td class="amount" style="border-top: 2px solid #000;"><strong>Rp {{ number_format($order->sisa_bayar, 0, ',', '.') }}</strong></td>
        </tr>
    </table>
    
    <div class="clearfix"></div>

    <div class="signature-box">
        Hormat Kami,<br>
        <div class="signature-line"></div>
        ( Capolista Finance )
    </div>

    <div class="clearfix"></div>

    <div class="footer">
        Pembayaran dapat ditransfer ke Rekening BCA: 123456789 a.n. Capolista.<br>
        Terima kasih atas kepercayaan Anda.
    </div>
</body>
</html>
