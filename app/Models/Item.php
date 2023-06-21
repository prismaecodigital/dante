<?php

namespace App\Models;

use App\Support\HasAdvancedFilter;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasAdvancedFilter, HasFactory;

    public $table = 'items';

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $orderable = [
        'id',
        'jenis_pekerjaan',
        'lokasi',
        'qty',
        'satuan',
        'price',
        'ket',
        'order_id',
    ];

    protected $filterable = [
        'id',
        'jenis_pekerjaan',
        'lokasi',
        'qty',
        'satuan',
        'price',
        'ket',
        'order_id',
    ];

    protected $fillable = [
        'jenis_pekerjaan',
        'lokasi',
        'qty',
        'satuan',
        'price',
        'ket',
        'order_id',
        'created_at',
        'updated_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}