<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use App\Support\HasAdvancedFilter;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasAdvancedFilter, HasFactory, HasFactory;

    public $table = 'services';

    protected $dates = [
        'upcoming_service',
        'latest_service',
        'created_at',
        'updated_at',
    ];

    protected $orderable = [
        'id',
        'upcoming_service',
        'customer',
        'address',
        'service',
        'latest_service',
        'created_at',
        'updated_at',
    ];

    protected $filterable = [
        'id',
        'upcoming_service',
        'customer',
        'address',
        'service',
        'latest_service',
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'upcoming_service',
        'customer',
        'address',
        'service',
        'latest_service',
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
}
