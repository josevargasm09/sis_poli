<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Arma;
use App\Models\ViewArma;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\WeaponRequest;
class ArmaController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewArma::orderBy('id', 'desc')->get()], 200);
    }

    public function get_arma_search()
    {
        $query_arma=Arma::all(['id','marca','modelo','calibre','serie']);
        $data_arma = [];
        foreach ($query_arma as $item) {
            $data_arma[] = [
                'id'=>$item->id,
                'full_name' =>$item->serie.'-'. $item->marca.' - '.$item->modelo.' - '.$item->calibre,
                'serie' =>$item->serie,
            ];
        }
        return response()->json(['status'=>'ok','data'=>$data_arma], 200);
    }

       // Reporte PDF
       public function indexArmaPdf(Request $request)
       {
           $data=$request->all();
           if (isset($data["search"])) {
               $text_search=$data["search"];
               $armas = ViewArma::select("*")
                ->where('marca', 'like', '%' . $text_search . '%')
                ->orWhere('modelo', 'like', '%' . $text_search . '%')
                ->orWhere('calibre', 'like', '%' . $text_search . '%')
                ->orWhere('serie', 'like', '%' . $text_search . '%')
                ->orWhere('status_description', 'like', '%' . $text_search . '%')
                ->orderBy('id','desc')
                ->get();
           }else{
               $armas = DB::table( 'view_arma' )->orderBy('id','desc')->get();
           }
           $pdf = PDF::loadView('armaReporte', ['armas' => $armas])->setPaper('a4', 'landscape');
           return $pdf->stream();
       }



    public function store(WeaponRequest $request)
    {
        try {
            DB::beginTransaction();
            Arma::create($request->all());
            DB::commit();
            return response()->json([
                'status' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 422,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function getArma()
    {
        return response()->json(['status'=>'ok','data'=>Arma::all(['id', 'marca', 'modelo', 'calibre','serie', 'estado'])], 200);
    }


    public function update(WeaponRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $arma = Arma::findOrFail($id);
            $arma->update($request->all());
            DB::commit();
            return response()->json([
                'status' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 422,
                'message' => $e->getMessage()
            ]);
        }
    }


    public function destroy($id)
    {
        $arma = Arma::findOrFail($id);
        $arma->delete();
        return 204;
    }
}
