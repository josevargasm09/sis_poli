<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewPerfil extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_perfil';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['comisaria','status_description','idperfil','descripcion','estado'];
}
