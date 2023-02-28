<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewLibro extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_libro';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['status_description','comisaria','seccion','idseccion','id','descripcion','estado'];
}
