<?php

namespace App\Models;

use App\Support\HasAdvancedFilter;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataAc extends Model
{
    use HasAdvancedFilter, HasFactory;

    public $table = 'data_ac';

    protected $orderable = [
        'order_id',
        'lokasi',
        'ampere_sebelum',
        'ampere_sesudah',
        'voltase_sebelum',
        'voltase_sesudah',
        'refrigen_sebelum',
        'refrigen_sesudah',
    ];

    protected $filterable = [
        'order_id',
        'lokasi',
        'ampere_sebelum',
        'ampere_sesudah',
        'voltase_sebelum',
        'voltase_sesudah',
        'refrigen_sebelum',
        'refrigen_sesudah',
    ];

    protected $fillable = [
        'order_id',
        'lokasi',
        'ampere_sebelum',
        'ampere_sesudah',
        'voltase_sebelum',
        'voltase_sesudah',
        'refrigen_sebelum',
        'refrigen_sesudah',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}