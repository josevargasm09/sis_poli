<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewComplaint extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'view_denuncia';

    public $timestamps = true;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    protected $fillable = ['color_report','distrito','comisaria','prov','dpto','type_complaint_description','formality_description','seccion_description','book_description','modality_description','id','number', 'idModalidad', 'idPersona', 'tipoDenuncia','idSeccion','idLibro','formalidad','fechaHecho','horaHecho','lugarHecho','direccionHecho','latitudHecho','longitudHecho','descripcion','correlativo'];
    
}