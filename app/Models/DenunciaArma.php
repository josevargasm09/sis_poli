<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class DenunciaArma extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'denuncia_arma';

    public $timestamps = true;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id','comisaria', 'idDenuncia', 'idArma'];
    


}