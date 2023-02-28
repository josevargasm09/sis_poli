<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ubigeo extends Model
{
    use HasFactory;
    protected $table = 'ubigeo';

    public $timestamps = false;

    protected $primaryKey = 'idperfil';

    protected $keyType = 'string';

    protected $fillable = ['ubigeo1', 'dpto','prov','distrito','ubigeo2'];
}
