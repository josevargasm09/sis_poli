<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Comisaria;
use App\Models\ViewComisaria;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\ComisariaRequest;
class ComisariaController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewComisaria::orderBy('id', 'desc')->get()], 200);
    }

    // Reporte PDF
    public function indexComiPdf(Request $request)
    {
        $data = $request->all();
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $comisarias = ViewComisaria::select("*")
                ->where('nom_comisaria', 'like', '%' . $text_search . '%')
                ->orWhere('status_description', 'like', '%' . $text_search . '%')
                ->orWhere('direccion', 'like', '%' . $text_search . '%')
                ->orWhere('phone', 'like', '%' . $text_search . '%')
                ->orWhere('email', 'like', '%' . $text_search . '%')
                ->orderBy('id', 'desc')
                ->get();
        } else {
            $comisarias = DB::table('view_comisaria')->orderBy('id', 'desc')->get();
        }
        $pdf = PDF::loadView('comisariaReporte', ['comisarias' => $comisarias])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }



    // ---------------------


    public function store(ComisariaRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $data['nom_comisaria'] = mb_strtoupper($data['nom_comisaria']);
            $data['direccion'] = mb_strtoupper($data['direccion']);
            $data['email'] = mb_strtoupper($data['email']);
            Comisaria::create($data);
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

    public function getComisaria()
    {
        return response()->json(['status' => 'ok', 'data' => Comisaria::all(['id', 'nom_comisaria',  'estado'])], 200);
    }

    public function update(ComisariaRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $comisaria = Comisaria::findOrFail($id);
            $data = $request->all();
            $data['nom_comisaria'] = mb_strtoupper($data['nom_comisaria']);
            $data['direccion'] = mb_strtoupper($data['direccion']);
            $data['email'] = mb_strtoupper($data['email']);
            $comisaria->update($data);
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

        $comisaria = Comisaria::findOrFail($id);
        $comisaria->delete();
        return 204;
    }
}
