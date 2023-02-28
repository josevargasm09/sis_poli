<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class ViewArma extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'view_arma';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['status_description','id','marca','modelo','calibre','serie','estado'];
}
