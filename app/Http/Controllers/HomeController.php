<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Resources\Admin\OrderResource;
use PDF;
use Carbon\Carbon;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function report($id, Order $order)
    {
        $order = Order::where('id', $id)->with('items')->first();

        $totalPrice = 0;

        foreach ($order->items as $item) {
            $subtotal = $item->qty * $item->price;
            $totalPrice += $subtotal;
        }
        
        $pdf = PDF::loadview('report', ['order' => $order, 'totalPrice' => $totalPrice]);
    	return $pdf->stream();
    }
}
