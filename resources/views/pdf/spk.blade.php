<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SPK - {{ $order->no_order }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 5px; vertical-align: top; }
        .info-table td.label { font-weight: bold; width: 150px; }
        .content { margin-bottom: 30px; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .details-table th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; text-align: center; }
        .signature-box { width: 30%; display: inline-block; text-align: center; margin-top: 30px; }
        .signature-line { border-bottom: 1px solid #000; margin-top: 50px; width: 80%; margin-left: 10%; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SURAT PERINTAH KERJA (SPK)</h1>
        <p>No. SPK: {{ $order->no_order }} | Tanggal: {{ $order->tanggal_order->format('d M Y') }}</p>
    </div>

    <table class="info-table">
        <tr>
            <td class="label">Customer</td>
            <td>: {{ $order->customer->nama ?? '-' }}</td>
            <td class="label">Deadline</td>
            <td>: <strong style="color:red">{{ $order->deadline->format('d M Y') }}</strong></td>
        </tr>
        <tr>
            <td class="label">Kontak</td>
            <td>: {{ $order->customer->kontak ?? '-' }}</td>
            <td class="label">Dibuat Oleh</td>
            <td>: {{ $order->creator->name ?? '-' }}</td>
        </tr>
    </table>

    <div class="content">
        <h3>Detail Pekerjaan:</h3>
        <table class="details-table">
            <thead>
                <tr>
                    <th>Jenis Produk</th>
                    <th>Jumlah</th>
                    <th>Ukuran / Detail Tambahan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $order->jenis_produk }}</td>
                    <td>{{ $order->jumlah }}</td>
                    <td>
                        @if($order->ukuran_detail)
                            @foreach($order->ukuran_detail as $key => $val)
                                {{ ucfirst($key) }}: {{ $val }}<br>
                            @endforeach
                        @else
                            -
                        @endif
                    </td>
                </tr>
            </tbody>
        </table>

        @if($order->catatan_produksi)
            <div style="margin-top: 15px; padding: 10px; border: 1px dashed #000; background: #f9f9f9;">
                <strong>Catatan Produksi:</strong><br>
                {{ $order->catatan_produksi }}
            </div>
        @endif

        @if($order->catatan_desain)
            <div style="margin-top: 15px; padding: 10px; border: 1px dashed #000;">
                <strong>Catatan Desain:</strong><br>
                {{ $order->catatan_desain }}
            </div>
        @endif
    </div>

    <div class="footer">
        <div class="signature-box">
            Dibuat Oleh,<br>
            <div class="signature-line"></div>
            ( {{ $order->creator->name ?? 'Admin' }} )
        </div>
        <div class="signature-box">
            Mengetahui,<br>
            <div class="signature-line"></div>
            ( Kepala Divisi )
        </div>
        <div class="signature-box">
            Penerima / Produksi,<br>
            <div class="signature-line"></div>
            ( .................... )
        </div>
    </div>
</body>
</html>
