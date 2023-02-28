<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Persona;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\PersonRequest;
use App\Http\Requests\PersonUpdateRequest;

class PersonaController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => Persona::orderBy('id', 'desc')->get()], 200);
    }

    // Reporte PDF
    public function indexPersonPdf(Request $request)
    {
        $data = $request->all();
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $personas = DB::table('persona')
            ->where('dni', 'like', '%' . $text_search . '%')
            ->orWhere('nombre', 'like', '%' . $text_search . '%')
            ->orWhere('ap_paterno', 'like', '%' . $text_search . '%')
            ->orWhere('ap_materno', 'like', '%' . $text_search . '%')
            ->orWhere('edad', 'like', '%' . $text_search . '%')
            ->orderBy('id','desc')->get();
        } else {
            $personas = DB::table('persona')->orderBy('id','desc')->get();
        }
        $pdf = PDF::loadView('personReporte', ['personas' => $personas])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }


    public function store(PersonRequest $request)
    {
        try {

            DB::beginTransaction();
            $data=$request->all();
            $data['nombre'] =mb_strtoupper($data['nombre']);
            $data['ap_paterno'] =mb_strtoupper($data['ap_paterno']);
            $data['ap_materno'] =mb_strtoupper($data['ap_materno']);
            Persona::create($data);
            // throw new \Exception('Ya existe una persona con ese número de dni');
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

    public function getPersona()
    {
        return response()->json(['status' => 'ok', 'data' => Persona::all([
            'dni',
            'nombre',
            'ap_paterno',
            'ap_materno',
            'edad',
            'nacimiento',
            'sexo',
            'celular',
            'estado_civil',
            'situacion',
        ])], 200);
    }

    public function get_person_search()
    {
        $query_person = Persona::all(['dni', 'id', 'nombre', 'ap_paterno', 'ap_materno']);
        $data_person = [];
        foreach ($query_person as $item) {
            $data_person[] = [
                'dni' => $item->dni,
                'full_name' => $item->dni . ' ' . $item->nombre . ' ' . $item->ap_paterno . ' ' . $item->ap_materno,
            ];
        }
        return response()->json(['status' => 'ok', 'data' => $data_person], 200);
    }

    public function update(PersonRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $persona = Persona::findOrFail($id);
            $data=$request->all();
            $data['nombre'] =mb_strtoupper($data['nombre']);
            $data['ap_paterno'] =mb_strtoupper($data['ap_paterno']);
            $data['ap_materno'] =mb_strtoupper($data['ap_materno']);
            $persona->update($data);
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
        $persona = Persona::findOrFail($id);
        $persona->delete();
        return 204;
    }
}
