<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Reporte extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'reporte';

    public $timestamps = true;

    protected $primaryKey = 'idreporte';

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['idreporte', 'descripcion'];
}
