<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Comisaria extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'comisaria';

    public $timestamps = true;
 
    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id', 'nom_comisaria','direccion','estado','email','phone'];
}
