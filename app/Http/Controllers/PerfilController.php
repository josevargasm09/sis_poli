<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Perfil;
use App\Models\ViewPerfil;
use App\Models\Permiso;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class PerfilController extends Controller
{

    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewPerfil::where('comisaria', auth()->user()->comisaria)->orderBy('idperfil', 'desc')->get()], 200);
    }


    // Reporte PDF
    public function indexPerfilPdf(Request $request)
    {
        $data = $request->all();
        $comisaria = auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $perfils = ViewPerfil::select("*")
                ->where(function ($q) use ($text_search) {
                    $q->where('descripcion', 'like', '%' . $text_search . '%');
                    $q->orWhere('status_description', 'like', '%' . $text_search . '%');
                })
                ->where('comisaria', $comisaria)
                ->orderBy('idperfil', 'desc')
                ->get();
        } else {
            $perfils = DB::table('view_perfil')->orderBy('idperfil', 'desc')->get();
        }
        $pdf = PDF::loadView('perfilReporte', ['perfils' => $perfils]);
        return $pdf->stream();
    }


    public function store(Request $request)
    {
        $data = $request->all();
        $modules = $data["modules"];
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        $new_perfil = Perfil::create($data + ['comisaria' => auth()->user()->comisaria]);

        $perfil_created = Perfil::latest('idperfil')->first();
        foreach ($modules as $module) {
            $new_permiso = Permiso::create(
                ['idperfil' => $perfil_created['idperfil'], 'idmodulo' => $module['idmodulo']]
            );
        }
        return ($new_perfil);
    }

    public function getPerfil()
    {
        return response()->json(['status' => 'ok', 'data' => Perfil::all(['idperfil', 'descripcion', 'estado'])], 200);
    }

    public function edit($id)
    {
        return response()->json(['status' => 'ok', 'data' => Permiso::whereNull('deleted_at')->where('idperfil', $id)->select("idmodulo")->get()], 200);
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $modules = $data["modules"];
        $perfil = Perfil::findOrFail($id);
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        $perfil->update($data + ['comisaria' => auth()->user()->comisaria]);
        Permiso::where('idperfil', $id)->delete();
        foreach ($modules as $module) {
            $new_permiso = Permiso::create(
                ['idperfil' =>  $id, 'idmodulo' => $module['idmodulo']]
            );
        }
        return $perfil;
    }

    public function destroy($id)
    {
        $perfil = Perfil::findOrFail($id);
        Permiso::where('idperfil', $id)->delete();
        $perfil->delete();
        return 204;
    }
}
