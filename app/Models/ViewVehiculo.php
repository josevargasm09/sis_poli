<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewVehiculo extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_vehiculo';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['status_description','situation_description','id','clase','situacion','marca','modelo','placa','estado'];
}
