<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewEspecie extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_especie';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['document_description','status_description','situation_description','id','serie', 'especie', 'documento','codigoDoc', 'situacion','estado'];
}
