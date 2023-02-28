<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ViewModality extends Model
{ 
    use HasFactory,SoftDeletes;

    protected $table = 'view_modality';

    public $timestamps = true;

    protected $keyType = 'string';

    // public $incrementing = false;

    protected $fillable = ['status_description','color_report','id','comisaria','descripcion','estado'];
}
