<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewComisaria extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_comisaria';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['status_description','id','nom_comisaria','direccion','estado','email','phone'];
}
