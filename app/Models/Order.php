<?php

namespace App\Models;

use App\Support\HasAdvancedFilter;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Order extends Model implements HasMedia
{
    use HasAdvancedFilter, HasFactory, InteractsWithMedia, HasFactory;

    public $table = 'orders';

    protected $appends = [
        'photodata',
        'photobefore',
        'photoafter',
        'jenis_order_label'
    ];

    protected $dates = [
        'date',
        'created_at',
        'updated_at',
    ];

    protected $orderable = [
        'id',
        'code',
        'date',
        'customer',
        'address',
        'jenis_order',
        'notes',
        'complaint',
        'created_at',
        'updated_at',
    ];

    protected $filterable = [
        'id',
        'code',
        'date',
        'customer',
        'address',
        'jenis_order',
        'notes',
        'complaint',
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'code',
        'date',
        'customer',
        'address',
        'jenis_order',
        'notes',
        'complaint',
        'created_at',
        'updated_at',
    ];

    public const JENIS_ORDER_SELECT = [
        [
            'label' => 'AC',
            'value' => '01',
        ],
        [
            'label' => 'Sipil',
            'value' => '02',
        ],
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function getDateAttribute($value)
    {
        return $value ? Carbon::createFromFormat('Y-m-d H:i:s', $value)->format('d-m-Y') : null;
    }

    public function setDateAttribute($value)
    {
        $this->attributes['date'] = $value ? Carbon::createFromFormat(config('project.date_format'), $value)->format('Y-m-d') : null;
    }

    public function getCreatedAtAttribute($value)
    {
        return $value ? Carbon::createFromFormat('Y-m-d H:i:s', $value)->format('d-m-Y') : null;
    }

    public function items()
    {
        return $this->hasMany(Item::class,'order_id');
    }

    public function getJenisOrderLabelAttribute()
    {
        return collect(static::JENIS_ORDER_SELECT)->firstWhere('value', $this->jenis_order)['label'] ?? '';
    }

    public function getPhotodataAttribute()
    {
        return $this->getMedia('order_photodata')->map(function ($item) {
            $media                      = $item->toArray();
            $media['url']               = $item->getUrl();
            $media['path']              = $item->getPath();

            return $media;
        });
    }

    public function getPhotobeforeAttribute()
    {
        return $this->getMedia('order_photobefore')->map(function ($item) {
            $media                      = $item->toArray();
            $media['url']               = $item->getUrl();
            $media['path']              = $item->getPath();

            return $media;
        });
    }

    public function getPhotoafterAttribute()
    {
        return $this->getMedia('order_photoafter')->map(function ($item) {
            $media                      = $item->toArray();
            $media['url']               = $item->getUrl();
            $media['path']              = $item->getPath();

            return $media;
        });
    }
}