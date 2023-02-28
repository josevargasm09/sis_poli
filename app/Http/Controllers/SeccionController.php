<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Seccion;
use App\Models\ViewSeccion;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class SeccionController extends Controller
{

    public function index() 
    {
        return response()->json(['status' => 'ok', 'data' => ViewSeccion::where('comisaria',auth()->user()->comisaria)->orderBy('id', 'desc')->get()], 200);
    }
    public function seccion_active() 
    {
        $query_seccion=Seccion::where('comisaria',auth()->user()->comisaria)->orderBy('id', 'desc')->where('estado','A')->get();
        $data_seccion[] = [
            'id' => '',
            'descripcion' => 'SELECCIONAR',
        ];
        foreach ($query_seccion as $item) {
            $data_seccion[] = [
                'id' => $item->id,
                'descripcion' => $item->descripcion,
            ];
        }
        return response()->json(['status' => 'ok', 'data' =>$data_seccion], 200);
    }

    // Reporte PDF
    public function indexSeccionPdf(Request $request)
    {
        $data=$request->all();
        $comisaria=auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search=$data["search"];
            $seccions = ViewSeccion::select("*")
            ->where(function ($q) use ($text_search) {
                $q->where('descripcion', 'like', '%' . $text_search . '%');
                $q->orWhere('status_description', 'like', '%' . $text_search . '%');
            })
            ->where('comisaria',$comisaria)
            ->orderBy('id','desc')
            ->get();
        }else{
            $seccions = DB::table('view_seccion')->where('comisaria',$comisaria)->orderBy('id','desc')->get();
        }
        $pdf = PDF::loadView('seccionReporte', ['seccions' => $seccions])->setPaper('a4', 'landscape');
        return $pdf->stream();
    } 

  

    // ---------------------
    

    public function store(Request $request)
    {
        $data = $request->all();
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        return Seccion::create($data+ ['comisaria' =>auth()->user()->comisaria]);
    }

    public function getSeccion()
    {
        return response()->json(['status'=>'ok','data'=>Seccion::select("*")->where('comisaria',auth()->user()->comisaria)->get()], 200);
    }

    public function update(Request $request, $id)
    {
        $seccion = Seccion::findOrFail($id);
        $data = $request->all();
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        $seccion->update($data+ ['comisaria' =>auth()->user()->comisaria]);
        return $seccion;
    }

    public function destroy($id)
    {
      
        $seccion = Seccion::findOrFail($id);
        $seccion->delete();
        return 204;
    }
}
