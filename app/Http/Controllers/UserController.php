<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\UserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => User::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->get()], 200);
    }

    // Reporte PDF
    public function indexUserPdf(Request $request)
    {
        $data = $request->all();
        $comisaria = auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $users = DB::table('users')->join('comisaria', 'users.comisaria', '=', 'comisaria.id')
                ->where(function ($q) use ($text_search) {
                    $q->where('users.name', 'like', '%' . $text_search . '%');
                    $q->orWhere('users.apellido', 'like', '%' . $text_search . '%');
                    $q->orWhere('users.usuarioCip', 'like', '%' . $text_search . '%');
                    $q->orWhere('users.email', 'like', '%' . $text_search . '%');
                    $q->orWhere('users.celular', 'like', '%' . $text_search . '%');
                })
                ->where('users.comisaria', $comisaria)
                ->orderBy('users.id', 'desc')->get();
        } else {
            $users = DB::table('users')->join('comisaria', 'users.comisaria', '=', 'comisaria.id')->orderBy('users.id', 'desc')->get();
        }
        $pdf = PDF::loadView('userReporte', ['users' => $users])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $data['password'] = Hash::make($data['password']);
            $data['name'] = mb_strtoupper($data['name']);
            $data['apellido'] = mb_strtoupper($data['apellido']);
            $data['dni'] = mb_strtoupper($data['dni']);
            $data['email'] = mb_strtoupper($data['email']);

            $data['comisaria'] = auth()->user()->comisaria;
            User::create($data);
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $user = User::findOrFail($id);
            $data = $request->all();
            $data['password'] = Hash::make($data['password']);
            $data['name'] = mb_strtoupper($data['name']);
            $data['apellido'] = mb_strtoupper($data['apellido']);
            $data['dni'] = mb_strtoupper($data['dni']);
            $data['email'] = mb_strtoupper($data['email']);

            $data['comisaria'] = auth()->user()->comisaria;
            $user->update($data);
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $usuario = User::findOrFail($id);
        $usuario->delete();
        return 204;
    }
}
