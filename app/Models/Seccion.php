<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Seccion extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'seccion';

    public $timestamps = true;
 
    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id','comisaria', 'descripcion',  'estado'];
}
