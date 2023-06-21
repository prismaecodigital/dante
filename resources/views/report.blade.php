<!DOCTYPE html>
<html>
<head>
	<title>Report Darmawan Teknik</title>
	<link rel="stylesheet" href="css/bootstrap-4.3.1.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
</head>
<body>
<style type="text/css">
	table tr td,
	table tr th{
		font-size: 9pt;
		text-align: left;
	}
	.less-space > th,
	.less-space > td {
		margin: 0px;
		padding: 5px 10px 0px 0px;
	}
	.table1 tr th {
		width: 50%;
	}
	.table2 thead tr th {
		margin: 0px;
		padding: 0px;
		font-size: 11pt;
		font-weight: normal;
		line-height: 12pt;
	}
	.table2 thead tr th,
	.table2 tbody tr td,
	.table2 tr th, .table2 tr td {
		border-bottom: none;
		border-top: none;
	},

.border-outside {
	border: none;
}

img {
	max-height: 100px;
	max-width: 100%;
}

	/* .container {
    width: 100%;
  }

  .row::after {
    content: "";
    display: flex;
    clear: both;
  }

  .column {
    float: left;
    width: 33.33%;
    padding: 10px;
  }
  .column-lg-3 {
    float: left;
    width: 30%;
    padding: 5px;
  } */
</style>

<div style="text-align: right; padding-bottom:10px">
	<img src="img/logo_dante2.png" width="30%" alt="logo Darmawan Teknik">
</div>


<center style="padding-bottom: 19px">
	<h4>LAPORAN HASIL PEKERJAAN</h4>
</center>

<table class='table1'>
	<tr class="less-space">
		<th style="">ID Order</th>
		<td>: {{$order->code}}</td>
	</tr>
	<tr class="less-space">
		<th style="">Tanggal</th>
		<td>: {{$order->date}}</td>
	</tr>
	<tr class="less-space">
		<th style="">Nama Pelanggan</th>
		<td>: {{$order->customer}}</td>
	</tr>
	<tr class="less-space">
		<th style="">Alamat</th>
		<td>: {{$order->address ?? '-'}}</td>
	</tr>
	<tr class="less-space">
		<th style="">Keluhan</th>
		<td>: {{$order->complaint ?? '-'}}</td>
	</tr>
	<tr class="less-space">
		<th></th>
		<td></td>
	</tr>
</table>


<table class='table table-bordered'>
	<thead>
		<tr>
			<th>No</th>
			<th>Jenis Pekerjaan</th>
			<th>Lokasi</th>
			<th>Jumlah</th>
			<th>Harga</th>
			<th>Total Harga</th>
			<th>Keterangan</th>
		</tr>
	</thead>
	<tbody>
		@foreach($order->items as $index => $item)
		<tr>
			<td>{{ $index+1 }}</td>
			<td>{{$item->jenis_pekerjaan}}</td>
			<td>{{$item->lokasi}}</td>
			<td>{{$item->qty}} {{$item->satuan ?? ''}}</td>
			<td>Rp. {{number_format($item->price, 0, '.', ',');}}</td>
			<td>Rp. {{number_format($item->price * $item->qty, 0, '.', ',')}}</td>
			<td>{{$item->ket ?? '-'}}</td>
		</tr>
		@endforeach
		<tr>
			<td></td>
			<td></td>
			<td></td>
			<td></td>
			<td>Total</td>
			<td>Rp. {{$totalPrice}}</td>
			<td></td>
		</tr>
	</tbody>
</table>

<table class="table1" style="width: 100%; padding-top: 10px;">
	<thead>
		<tr>
			<td style="width: 33.33%; padding-bottom: 10px">
				Data
			</td>
			<td style="width: 33.33%; padding-bottom: 10px">
				Sebelum
			</td>
			<td style="width: 33.33%; padding-bottom: 10px">
				Sesudah
			</td>
		</tr>
	</thead>
	<tbody>
		@foreach ($order->photodata as $index => $photodata)
		<tr>
			<td style="width: 33.33%;">
				<img src="{{$order->photodata[$index]['path'] ?? ''}}" style="width: auto;" alt="">
			</td>
			<td style="width: 33.33%;">
				<img src="{{$order->photobefore[$index]['path'] ?? ''}}" style="width: auto;" alt="">
			</td>
			<td style="width: 33.33%;">
				<img src="{{$order->photoafter[$index]['path'] ?? ''}}" style="width: auto;" alt="">
			</td>
		</tr>
		@endforeach
	</tbody>
</table>

<b>Instruksi Pembayaran</b>
<p style="font-size: 10pt">- Transfer a/n Muhammad Awaldianto. BCA No Rek. 0954366134</p>

<table class="table table2 table-bordered">
	<thead>
		
		<tr>
			<th class="text-center">Diajukan</th>
			<th class="text-center">{{ date('d M Y', strtotime('now')) }}<br>Disetujui</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="text-center"><img src="img/ttd_awal.jpg" alt="" style="max-width: 90px"></td>
			<td class="text-center"><textarea style="border: none" name="" id="" cols="30" rows="4"></textarea></td>
		</tr>
		<tr>
			<td class="text-center" style="font-size: 10pt">Muhammad Awaldianto</td>
			<td class="text-center" style="font-size: 10pt">{{$order->customer}}</td>
		</tr>
	</tbody>
</table>

<table class="table table2 table-bordered">
	<tr>
		<th>*Notes</th>
	</tr>
	<tr>
		<td style="font-size: 10pt">{{$order->notes ?? '-'}}</td>
	</tr>
</table>

<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>

</body>

</html>