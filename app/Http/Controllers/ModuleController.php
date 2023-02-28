<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Module;
class ModuleController extends Controller
{
    public function index()
    {
        return response()->json(['status'=>'ok','data'=>Module::all()], 200);
    }
    
    // public function store(Request $request)
    // {
    //     return Perfil::create($request->all());
    // }

    public function getModule()
    {
        return response()->json(['status'=>'ok','data'=>Module::where('orden',1)->select("idmodulo","descripcion")->get()], 200);
    }

    public function edit($id)
    {
        //
    } 
    public function store(Request $request)
    {   
        
        return $request->all();
    }

    // public function update(Request $request, $id)
    // {
    //     $perfil = Perfil::findOrFail($id);
    //     $perfil->update($request->all());
    //     return $perfil;
    // }

    // public function destroy($id)
    // {
    //     $perfil = Perfil::findOrFail($id);
    //     $perfil->delete();
    //     return 204;
    // }
}
