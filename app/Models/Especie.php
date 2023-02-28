<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Especie extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'especie';

    public $timestamps = true;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id','serie', 'especie', 'documento','codigoDoc', 'situacion','estado'];
}
