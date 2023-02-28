<?php

namespace App\Http\Controllers;

use App\Models\Modality;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\ViewModality;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class ModalityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewModality::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->get()], 200);
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
    public function random_color_part()
    {
        return str_pad(dechex(mt_rand(0, 255)), 2, '0', STR_PAD_LEFT);
    }

    public function random_color()
    {
        return $this->random_color_part() . $this->random_color_part() . $this->random_color_part();
    }



    public function store(Request $request)
    {
        $color = '#' . $this->random_color();
        $data = $request->all();
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        return Modality::create($data + ['comisaria' => auth()->user()->comisaria] + ['color_report' => $color]);
    }

    public function modality_active()
    {
        $query_modality = Modality::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->where('estado', 'A')->get();
        $data_modality[] = [
            'id' => '',
            'descripcion' => 'SELECCIONAR',
        ];
        foreach ($query_modality as $item) {
            $data_modality[] = [
                'id' => $item->id,
                'descripcion' => $item->descripcion,
            ];
        }
        return response()->json(['status' => 'ok', 'data' => $data_modality], 200);
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
    public function update(Request $request, $id)
    {
        $modality = Modality::findOrFail($id);
        $data = $request->all();
        $data['descripcion'] = mb_strtoupper($data['descripcion']);
        $modality->update($data + ['comisaria' => auth()->user()->comisaria]);
        return $modality;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $modality = Modality::findOrFail($id);
        $modality->delete();
        return 204;
    }
    public function report_modality_pdf(Request $request)
    {
        $data = $request->all();
        $comisaria = auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search = $data["search"];

            $modalitys = ViewModality::select("*")
                ->where(function ($q) use ($text_search) {
                    $q->where('descripcion', 'like', '%' . $text_search . '%');
                    $q->orWhere('status_description', 'like', '%' . $text_search . '%');
                })
                ->where('comisaria', $comisaria)
                ->orderBy('id', 'desc')
                ->get();
        } else {
            $modalitys = DB::table('view_modality')->where('comisaria', $comisaria)->orderBy('id', 'desc')->get();
        }
        $pdf = PDF::loadView('report/modalityReport', ['modalitys' => $modalitys])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }
}
