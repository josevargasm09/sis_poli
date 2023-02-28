<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Persona extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'persona';
    public $timestamps = true;
    protected $primaryKey = 'id';
    
    protected $fillable = [ 
        'dni',
        'nombre',
        'ap_paterno',
        'ap_materno',
        'edad',
        'nacimiento',
        'sexo',
        'celular',
        'estado_civil',
        'situacion',
        'deleted_at',

    ];
    
 
}
