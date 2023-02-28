<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Perfil extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'perfil';

    public $timestamps = true;

    protected $primaryKey = 'idperfil';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['idperfil', 'descripcion','estado','comisaria'];
}
