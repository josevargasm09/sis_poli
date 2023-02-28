<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Permiso extends Model
{
    use HasFactory;
    
    use SoftDeletes;

    protected $table = 'permisos';

    public $timestamps = true;

    protected $primaryKey = 'idpermiso';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['idpermiso', 'idperfil', 'idmodulo'];
    


}