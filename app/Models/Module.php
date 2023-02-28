<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Module extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'modulos';

    public $timestamps = true;

    protected $primaryKey = 'idmodulo';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['idmodulo', 'descripcion', 'url', 'padre','icono','orden'];
    


}