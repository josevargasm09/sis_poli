<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehiculo;
use App\Models\ViewVehiculo;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\VehicleRequest;
class VehiculoController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewVehiculo::orderBy('id', 'desc')->get()], 200);
    }

    public function get_vehiculo_search()
    {
        $query_vehiculo = Vehiculo::all(['id', 'clase', 'marca', 'modelo', 'placa', 'situacion']);
        $data_vehiculo = [];
        foreach ($query_vehiculo as $item) {
            $data_vehiculo[] = [
                'placa' => $item->placa,
                'full_name' => $item->placa . ' ' . $item->clase . ' ' . $item->marca . ' ' . $item->modelo,
            ];
        }
        return response()->json(['status' => 'ok', 'data' => $data_vehiculo], 200);
    }

    // Reporte PDF
    public function indexVehiPdf(Request $request)
    {
        $data = $request->all();
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $vehiculos = ViewVehiculo::select("*")
                ->where('clase', 'like', '%' . $text_search . '%')
                ->orWhere('marca', 'like', '%' . $text_search . '%')
                ->orWhere('modelo', 'like', '%' . $text_search . '%')
                ->orWhere('placa', 'like', '%' . $text_search . '%')
                ->orWhere('status_description', 'like', '%' . $text_search . '%')
                ->orWhere('situation_description', 'like', '%' . $text_search . '%')
                ->orderBy('id','desc')
                ->get();
        } else {
            $vehiculos = DB::table('view_vehiculo')->orderBy('id','desc')->get();
        }
        $pdf = PDF::loadView('vehiculoReporte', ['vehiculos' => $vehiculos])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }

    public function store(VehicleRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $data['marca'] = mb_strtoupper($data['marca']);
            $data['modelo'] = mb_strtoupper($data['modelo']);
            $data['calibre'] = mb_strtoupper($data['calibre']);
            $data['serie'] = mb_strtoupper($data['serie']);
            Vehiculo::create($data);
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

    public function getPerfil()
    {
        return response()->json(['status' => 'ok', 'data' => Vehiculo::all(['id', 'clase', 'marca', 'modelo', 'placa', 'situacion', 'estado'])], 200);
    }

    public function update(VehicleRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $vehiculo = Vehiculo::findOrFail($id);
            $data = $request->all();
            $data['marca'] = mb_strtoupper($data['marca']);
            $data['modelo'] = mb_strtoupper($data['modelo']);
            $data['calibre'] = mb_strtoupper($data['calibre']);
            $data['serie'] = mb_strtoupper($data['serie']);
            $vehiculo->update($data);
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
        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->delete();
        return 204;
    }
}
