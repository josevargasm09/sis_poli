<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Especie;
use App\Models\ViewEspecie;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\EspecieRequest;

class EspecieController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewEspecie::orderBy('id', 'desc')->get()], 200);
    }

    public function get_especie_search()
    {
        $query_especie = Especie::all(['id', 'serie', 'especie', 'documento', 'codigoDoc', 'situacion']);
        $data_especie = [];
        foreach ($query_especie as $item) {
            $data_especie[] = [
                'serie' => $item->serie,
                'full_name' => $item->serie . '-' . $item->especie,
            ];
        }
        return response()->json(['status' => 'ok', 'data' => $data_especie], 200);
    }
    // $users = User::select("*")
    // ->where('id', 23)
    // ->orWhere('email', 'itsolutionstuff@gmail.com')
    // ->get();
    // Reporte PDF
    public function indexEspePdf(Request $request)
    {
        $data = $request->all();
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $especies = ViewEspecie::select("*")
                ->where('serie', 'like', '%' . $text_search . '%')
                ->orWhere('especie', 'like', '%' . $text_search . '%')
                ->orWhere('codigoDoc', 'like', '%' . $text_search . '%')
                ->orWhere('document_description', 'like', '%' . $text_search . '%')
                ->orWhere('status_description', 'like', '%' . $text_search . '%')
                ->orWhere('situation_description', 'like', '%' . $text_search . '%')
                ->orderBy('id', 'desc')
                ->get();
        } else {
            $especies = DB::table('view_especie')->orderBy('id', 'desc')->get();
        }
        $pdf = PDF::loadView('especieReporte', ['especies' => $especies])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }

    public function store(EspecieRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $data['especie'] = mb_strtoupper($data['especie']);
            $data['codigoDoc'] = mb_strtoupper($data['codigoDoc']);
            $data['serie'] = mb_strtoupper($data['serie']);
            Especie::create($data);
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
    public function getEspecie()
    {
        return response()->json(['status' => 'ok', 'data' => Especie::all(['id', 'serie', 'especie', 'documento', 'codigoDoc', 'situacion', 'estado'])], 200);
    }

    public function update(EspecieRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $especie = Especie::findOrFail($id);
            $data = $request->all();
            $data['especie'] = mb_strtoupper($data['especie']);
            $data['codigoDoc'] = mb_strtoupper($data['codigoDoc']);
            $data['serie'] = mb_strtoupper($data['serie']);
            $especie->update($data);
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
        $especie = Especie::findOrFail($id);
        $especie->delete();
        return 204;
    }
}
