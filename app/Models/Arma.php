<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Arma extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'arma';

    public $timestamps = true;

    protected $primaryKey = 'id';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['id', 'marca', 'modelo', 'calibre','serie', 'estado'];
}