<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Libro;
use App\Models\ViewLibro;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\BookRequest;

class LibroController extends Controller
{

    public function index()
    {

        return response()->json(['status' => 'ok', 'data' => ViewLibro::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->get()], 200);
    }
    public function book_active()
    {
        $query_book = Libro::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->where('estado', 'A')->get();
        $data_book[] = [
            'id' => '',
            'descripcion' => 'SELECCIONAR',
            'idseccion' => '',
        ];
        foreach ($query_book as $item) {
            $data_book[] = [
                'id' => $item->id,
                'descripcion' => $item->descripcion,
                'idseccion' => $item->idseccion,
            ];
        }
        return response()->json(['status' => 'ok', 'data' => $data_book], 200);
    }

    // Reporte PDF
    public function indexLibroPdf(Request $request)
    {
        $data = $request->all();
        $comisaria = auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $libros = ViewLibro::select("*")
                ->where(function ($q) use ($text_search) {
                    $q->where('descripcion', 'like', '%' . $text_search . '%');
                    $q->orWhere('status_description', 'like', '%' . $text_search . '%');
                    $q->orWhere('seccion', 'like', '%' . $text_search . '%');
                })
                ->where('comisaria', $comisaria)
                ->orderBy('id', 'desc')
                ->get();
        } else {
            $libros = DB::table('view_libro')->where('comisaria', $comisaria)->orderBy('id', 'desc')->get();
        }
        $pdf = PDF::loadView('libroReporte', ['libros' => $libros])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }



    // ---------------------


    public function store(BookRequest $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $data['descripcion'] = mb_strtoupper($data['descripcion']);
            Libro::create($data + ['comisaria' => auth()->user()->comisaria]);
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

    public function getLibro()
    {
        return response()->json(['status' => 'ok', 'data' => Libro::select("*")->where('comisaria', auth()->user()->comisaria)->get()], 200);
    }

    public function update(BookRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            $libro = Libro::findOrFail($id);
            $data = $request->all();
            $data['descripcion'] = mb_strtoupper($data['descripcion']);
            $libro->update($data + ['comisaria' => auth()->user()->comisaria]);
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

        $libro = Libro::findOrFail($id);
        $libro->delete();
        return 204;
    }
}
