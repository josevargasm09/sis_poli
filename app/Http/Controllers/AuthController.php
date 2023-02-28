<?php

namespace App\Http\Controllers;

use App\Models\Comisaria;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class AuthController extends Controller
{
    public function register(Request $request,  $user){
        $validatedData=$request->validate([
            'name'=>'required|string|max:255',
            'email'=>['required','|string|', 'max:255|','unique:users,email'],
            'password'=>'required|string|min:8',
        ]);
       
        $user=User::create([
                'name'=>$validatedData['name'],
                'email'=>$validatedData['email'],
                'password'=>Hash::make($validatedData['password']),
            ]);
         $token =$user->createToken('auth_token')->plainTextToken;
         
         return response()->json([
             'access_token'=>$token,
             'token_type'=>'Bearer'
         ]);
    }
    public function login(Request $request){
      
        if(!Auth::attempt($request->only('usuarioCip','password'))){
            return response()->json([
                'message'=>'Invalid login details',
                'success'=>false,
                
            ]);
        }
        $user=User::where('usuarioCip',$request['usuarioCip'])->firstOrFail();

        $token=$user->createToken("auth_token")->plainTextToken;
        $name=$user->name;
        $idperfil=$user->idperfil;
        $comisaria = $user->comisaria;
        $data_comisaria = Comisaria::where('id',$comisaria)->firstOrFail();
        $token2 = csrf_token();
        return response()->json([
            'access_token'=>$token,
            'token_type'=>'Bearer',
            'token2'=>$token2 ,
            'name'=>$name,
            'success'=>true,
            'comisaria'=>$data_comisaria->nom_comisaria,
            'idperfil'=>$idperfil,
        ]);
    }

    public function infouser(Request $request){
        return $request->user();
    }

    public function logout (Request $request){
        try {
            $request->user()->currentAccessToken()->delete();
            DB::commit();
            return response()->json([
                'status' => true,
            ]);
        } 
        catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        } 
    }
    public function list_modulos($id)
    {
        $data = DB::select(" SELECT m.idmodulo as idmodulo, m.descripcion as modulos, mo.descripcion as submodulos, mo.idmodulo as idsubmodulo, m.icono as icono , mo.url as url from permisos as p INNER JOIN modulos as m ON p.idmodulo=m.idmodulo INNER JOIN modulos as mo ON mo.padre=m.idmodulo where p.idperfil='$id' and p.deleted_at IS NULL  order by m.idmodulo");
        $response['data'] = $data;
        return $response;
    }
}
