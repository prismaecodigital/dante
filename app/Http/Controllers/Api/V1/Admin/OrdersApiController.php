<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Item;
use App\Models\DataAc;
use App\Models\Service;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use PDF;
use Illuminate\Support\Facades\Storage;

class OrdersApiController extends Controller
{
    public function index(Request $request)
    {
        return new OrderResource(Order::advancedFilter()
                ->when($request->filled('jenis'), function($query) use ($request){
                    return $query->where('jenis_order', $request->query('jenis'));
                })
                ->paginate(request('limit', 10)));      
    }

    public function store(Request $request)
    {
        $data = $request->only([
            'date',
            'customer',
            'address',
            'complaint',
            'jenis_order',
            'notes'
        ]);

        $data['created_at'] = Carbon::now();
        $data['code'] = $this->generateCode($data['created_at'], $data['jenis_order']);

        $order = Order::create($data);

        if($request->input('jenis') === '01'){
            $service = [
                'upcoming_service' => $request->input('upcoming'),
                'customer' => $request->input('customer'),
                'address' => $request->input('address'),
                'service' => $request->input('job'),
                'latest_service' => $request->input('date'),
                'status' => '0'
            ];
            Service::create($service);
        }
        

        if ($media = $request->input('photodata', [])) {
            Media::whereIn('id', data_get($media, '*.id'))
                ->where('model_id', 0)
                ->update(['model_id' => $order->id]);
        }

        if ($media = $request->input('photobefore', [])) {
            Media::whereIn('id', data_get($media, '*.id'))
                ->where('model_id', 0)
                ->update(['model_id' => $order->id]);
        }

        if ($media = $request->input('photoafter', [])) {
            Media::whereIn('id', data_get($media, '*.id'))
                ->where('model_id', 0)
                ->update(['model_id' => $order->id]);
        }

        foreach ($request->items as $item) {
            $item = Item::create([
                'jenis_pekerjaan' => $item['jenis_pekerjaan'],
                'lokasi' => $item['lokasi'] ?? '-',
                'qty' => $item['qty'] ?? '-',
                'satuan' => $item['satuan'] ?? '-',
                'price' => $item['price'],
                'ket' => $item['ket'] ?? '-',
                'order_id' => $order->id,
            ]);
        }

        // Added data
        if(count($request->datas) > 0) {
            foreach($request->datas as $datax) {
                $datax = DataAc::create([
                    'order_id'          => $order->id,
                    'lokasi'            => $datax['lokasi'],
                    'ampere_sebelum'    => $datax['ampere_sebelum'],
                    'ampere_sesudah'    => $datax['ampere_sesudah'],
                    'voltase_sebelum'   => $datax['voltase_sebelum'],
                    'voltase_sesudah'   => $datax['voltase_sesudah'],
                    'refrigen_sebelum'  => $datax['refrigen_sebelum'],
                    'refrigen_sesudah'  => $datax['refrigen_sesudah'],
                ]);
            }
        }
        
        $mediaItems = Media::where('model_id', 0)->get();

        foreach ($mediaItems as $media) {
            $path = $media->getPath();
        
            $media->delete();
        
            if (Storage::exists($path)) {
                Storage::deleteDirectory($path);
            }
        }

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    
    }
    
    protected function generateCode($createdAt, $type)
    {
        $count = Order::whereYear('created_at', $createdAt)
            ->whereMonth('created_at', $createdAt)
            ->count();
    
        $number = str_pad($count + 1, 3, "0", STR_PAD_LEFT);
        $dateCode = substr($createdAt, 2, 2) . substr($createdAt, 5, 2);
    
        return 'DT' . $type . $dateCode . $number;
    }

    public function create()
    {
        return response([
            'meta' => [
                'jenis_order' => Order::JENIS_ORDER_SELECT,
            ],
        ]);
    }

    public function show(Order $Order)
    {
        return new OrderResource($Order->load(['items','datas']));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {

        // dd($request->all());
        foreach($request->items as $item) {
            Item::where('id', $item['id'])->update([
                'jenis_pekerjaan' => $item['jenis_pekerjaan'],
                'lokasi' => $item['lokasi'] ?? '-',
                'qty' => $item['qty'] ?? '-',
                'satuan' => $item['satuan'] ?? '-',
                'price' => $item['price'],
                'ket' => $item['ket'] ?? '-',
            ]);
        }

        if(count($request->datas) > 0) {
            foreach($request->datas as $datax) {
                DataAc::where('id', $datax['id'])->update([
                    'lokasi'            => $datax['lokasi'],
                    'ampere_sebelum'    => $datax['ampere_sebelum'],
                    'ampere_sesudah'    => $datax['ampere_sesudah'],
                    'voltase_sebelum'   => $datax['voltase_sebelum'],
                    'voltase_sesudah'   => $datax['voltase_sesudah'],
                    'refrigen_sebelum'  => $datax['refrigen_sebelum'],
                    'refrigen_sesudah'  => $datax['refrigen_sesudah'],
                ]);
            }
        }

        $order->update($request->validated());

        $order->updateMedia($request->input('photodata', []), 'order_photodata');
        $order->updateMedia($request->input('photobefore', []), 'order_photobefore');
        $order->updateMedia($request->input('photoafter', []), 'order_photoafter');
        
        return (new OrderResource($order))
        ->response()
        ->setStatusCode(Response::HTTP_ACCEPTED);
    }

    public function edit(Order $order)
    {
        return response([
            'data' => new OrderResource($order->load(['items', 'datas'])),
            'meta' => [
                'jenis_order' => Order::JENIS_ORDER_SELECT,
            ],
        ]);
    }

    public function destroy(Order $Order)
    {
        // abort_if(Gate::denies('pkab_item_delete'), Response::HTTP_FORBIDDEN, '403 Forbidden');

        $Order->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }

    public function storeMedia(Request $request)
    {
        if ($request->has('size')) {
            $this->validate($request, [
                'file' => 'max:' . $request->input('size') * 1024,
            ]);
        }

        $model         = new Order();
        $model->id     = $request->input('model_id', 0);
        $model->exists = true;
        $media         = $model->addMediaFromRequest('file')->toMediaCollection($request->input('collection_name'));

        return response()->json($media, Response::HTTP_CREATED);
    }

    public function destroyMedia(Request $request)
    {
        return response()->json($request->all());
    }

    public function report($id)
    {
        $order = Order::where('id', $id)->with(['items', 'datas'])->first();
        if($pdf->jenis_order === '01') {
            $pdf = PDF::loadview('report', $order);
        }
        if($pdf->jenis_order === '02') {
            $pdf = PDF::loadview('reportSipil', $order);
        }
    	return $pdf->stream();
    }
}