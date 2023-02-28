<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\Reporte;


class ReporteController extends Controller
{
   
    public function index()
    {
        return response()->json(['status'=>'ok','data'=>Reporte::all()], 200); 
    }
    
    public function store(Request $request)
    {
        return Reporte::create($request->all());
    }

    public function getReporte()
    {
        return response()->json(['status'=>'ok','data'=>Reporte::all(['idreporte', 'descripcion'])], 200);
    }

    public function edit($id)
    {
        //
    } 

    public function update(Request $request, $id)
    {
        $reporte = Reporte::findOrFail($id);
        $reporte->update($request->all());
        return $reporte;
    }

    public function destroy($id)
    {
        $reporte = Reporte::findOrFail($id);
        $reporte->delete();
        return 204;
    }
}
