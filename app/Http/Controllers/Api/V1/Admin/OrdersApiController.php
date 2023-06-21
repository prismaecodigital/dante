<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Item;
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
    public function index()
    {                
        return new OrderResource(Order::advancedFilter()
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
        return new OrderResource($Order->load(['items']));
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
            'data' => new OrderResource($order->load(['items'])),
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
        $order = Order::where('id', $id)->with('items')->first();

        $pdf = PDF::loadview('report', $order);
    	return $pdf->stream();
    }
}