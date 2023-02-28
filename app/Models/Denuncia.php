<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Denuncia extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'denuncia';

    public $timestamps = true;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id','correlativo','comisaria','number', 'idModalidad', 'idPersona', 'tipoDenuncia','idSeccion','idLibro','formalidad','fechaHecho','horaHecho','lugarHecho','direccionHecho','latitudHecho','longitudHecho','descripcion'];
    


}