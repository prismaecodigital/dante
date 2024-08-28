<?php

namespace App\Http\Resources\Admin;

use App\Models\Order;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        $jenis = Order::JENIS_ORDER_SELECT;
        array_unshift($jenis, ['label' => 'Semua Jenis Order', 'value' => null]);
        return array_merge(parent::toArray($request), [
            'jenis' => $jenis, // Add your custom key-value pair here
        ]);
    }
}
