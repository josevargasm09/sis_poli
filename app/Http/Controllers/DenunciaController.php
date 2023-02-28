<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Denuncia;
use App\Models\DenunciaPersona;
use App\Models\Persona;
use App\Models\DenunciaArma;
use App\Models\DenunciaEspecie;
use App\Models\DenunciaVehiculo;
use App\Models\ViewComplaint;
use App\Models\Arma;
use App\Models\Especie;
use App\Models\Vehiculo;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use App\Http\Requests\ComplaintRequest;
use App\Models\Comisaria;
use Illuminate\Support\Facades\Config;

class DenunciaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['status' => 'ok', 'data' => ViewComplaint::where('comisaria', auth()->user()->comisaria)->orderBy('id', 'desc')->get()], 200);
    }

    public function complaint_list_report(Request $request)
    {
        $data = $request->all();

        $filters = json_decode($data["filters"]);

        $modality = $filters->id_modalidad;
        $type_complaint = $filters->id_tipoDenuncia;
        $id_seccion = $filters->id_seccion;
        $id_libro = $filters->id_libro;
        $fecha_inicio = $filters->fecha_inicio;
        $fecha_fin = $filters->fecha_fin;
        $dni = $filters->dni;
        $array_id_complaints = [];
        $id_complaints = DenunciaPersona::select('denuncia_persona.idDenuncia')->join('persona', 'persona.id', '=', 'denuncia_persona.idPersona')->where('denuncia_persona.tipoPersona', '1')->where('persona.dni', $dni)->get();
        foreach ($id_complaints as $row) {
            $ids = $row->idDenuncia;
            array_push($array_id_complaints, $ids);
        }
        $data_complint = ViewComplaint::where('comisaria', auth()->user()->comisaria)
            ->where(function ($query) use ($array_id_complaints, $modality, $dni, $type_complaint, $id_seccion, $id_libro, $fecha_inicio, $fecha_fin) {

                if ($modality != '') {
                    $query->where('idModalidad', $modality);
                }

                if ($fecha_inicio != '' && $fecha_fin != '') {
                    $query->whereBetween('fechaHecho', [$fecha_inicio, $fecha_fin]);
                }

                if ($type_complaint != '') {
                    $query->where('tipoDenuncia', $type_complaint);
                }
                if ($id_seccion != '') {
                    $query->where('idSeccion', $id_seccion);
                }
                if ($id_libro != '') {
                    $query->where('idLibro', $id_libro);
                }
                if ($dni != '') {
                    $query->whereIn('id', $array_id_complaints);
                }
            })
            ->orderBy('id', 'desc')->get();

        return response()->json(['status' => 'ok', 'data_complaint' => $id_complaints, 'data' => $data_complint], 200);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function get_consecutivo($table, $id)
    {
        $comisaria = auth()->user()->comisaria;
        $mostrar = DB::select("select * from $table where comisaria=$comisaria order by $id DESC limit 1 ");
        $actu = 0;
        if (!$mostrar) {
            $actu = 0;
        } else {
            $actu = intval($mostrar[0]->$id);
        }
        $new = $actu + 1;
        return $new;
    }

    public function store(ComplaintRequest $request)
    {
        try {

            $id_denuciante = config("constants.TYPE_PERSON.DENUCIANTE");
            $id_denunciado = config("constants.TYPE_PERSON.DENUNCIADO");
            $id_agraviado = config("constants.TYPE_PERSON.AGRAVIADO");

            DB::beginTransaction();

            $denunciantes = $request->input('denunciantes');
            $denunciados = $request->input('denunciados');
            $agraviados = $request->input('agraviados');
            $armas = $request->input('armas');
            $especies = $request->input('especies');
            $vehiculos = $request->input('vehiculos');
            $correlativo = $this->get_consecutivo('denuncia', 'correlativo');

            $data = $request->all();
            $data['direccionHecho'] = mb_strtoupper($data['direccionHecho']);
            $data['descripcion'] = mb_strtoupper($data['descripcion']);

            Denuncia::create($data + ['comisaria' => auth()->user()->comisaria] + ['correlativo' => $correlativo]);
            $denuncia_created = Denuncia::latest('id')->first();
            $id_denuncia = $denuncia_created->id;

            if (!empty($denunciantes)) {
                foreach ($denunciantes as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id_denuncia,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_denuciante,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($denunciados)) {
                foreach ($denunciados as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id_denuncia,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_denunciado,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($agraviados)) {
                foreach ($agraviados as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id_denuncia,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_agraviado,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($armas)) {
                foreach ($armas as $row) {
                    $serie = $row['serie'];
                    $arma = Arma::where('serie', $serie)->get()->first();
                    DenunciaArma::create([
                        'idDenuncia' => $id_denuncia,
                        'idArma' => $arma->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($especies)) {
                foreach ($especies as $row) {
                    $serie = $row['serie'];
                    $especie = Especie::where('serie', $serie)->get()->first();
                    DenunciaEspecie::create([
                        'idDenuncia' => $id_denuncia,
                        'idEspecie' => $especie->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };

            if (!empty($vehiculos)) {
                foreach ($vehiculos as $row) {
                    $placa = $row['placa'];
                    $vehiculo = Vehiculo::where('placa', $placa)->get()->first();
                    DenunciaVehiculo::create([
                        'idDenuncia' => $id_denuncia,
                        'idVehiculo' => $vehiculo->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };



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
    public function detail_complaint($id)
    {
        $query_denuncia_arma = DenunciaArma::where('idDenuncia', $id)->where('deleted_at', null)->get();
        $query_denuncia_denunciante = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '1')->get();
        $query_denuncia_denunciado = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '2')->get();
        $query_denuncia_agraviado = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '3')->get();
        $query_denuncia_especie = DenunciaEspecie::where('idDenuncia', $id)->where('deleted_at', null)->get();
        $query_denuncia_vehiculo = DenunciaVehiculo::where('idDenuncia', $id)->where('deleted_at', null)->get();

        $data_arma = [];
        $data_denunciante = [];
        $data_denunciado = [];
        $data_agraviado = [];
        $data_especie = [];
        $data_vehiculo = [];

        foreach ($query_denuncia_vehiculo as $item) {
            $query_vehiculo = Vehiculo::where('id', $item->idVehiculo)->get();
            $data_vehiculo[] = [
                'placa' => $query_vehiculo[0]->placa,
                'full_name' => $query_vehiculo[0]->placa . ' ' . $query_vehiculo[0]->clase . ' ' . $query_vehiculo[0]->marca . ' ' . $query_vehiculo[0]->modelo,
            ];
        }

        foreach ($query_denuncia_arma as $item) {
            $query_arma = Arma::where('id', $item->idArma)->get();
            $data_arma[] = [
                'id' => $query_arma[0]->id,
                'full_name' => $query_arma[0]->serie . '-' . $query_arma[0]->marca . ' - ' . $query_arma[0]->modelo . ' - ' . $query_arma[0]->calibre,
                'serie' => $query_arma[0]->serie,
            ];
        }
        foreach ($query_denuncia_especie as $item) {
            $query_especie = Especie::where('id', $item->idEspecie)->get();
            $data_especie[] = [
                'serie' => $query_especie[0]->serie,
                'full_name' => $query_especie[0]->serie . '-' . $query_especie[0]->especie,
            ];
        }

        foreach ($query_denuncia_denunciante as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciante[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_denunciado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciado[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_agraviado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_agraviado[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        return response()->json(['status' => 'ok', 'data_vehiculo' => $data_vehiculo, 'data_especie' => $data_especie, 'data_agraviado' => $data_agraviado, 'data_arma' => $data_arma, 'data_denunciante' => $data_denunciante, 'data_denunciado' => $data_denunciado], 200);
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
    public function complaint_detail_total()
    {
        $comisaria = auth()->user()->comisaria;
        $query_denuncia_arma = DenunciaArma::where('comisaria', $comisaria)->where('deleted_at', null)->get();
        $query_denuncia_denunciante = DenunciaPersona::where('comisaria', $comisaria)->where('deleted_at', null)->where('tipoPersona', '1')->get();
        $query_denuncia_denunciado = DenunciaPersona::where('comisaria', $comisaria)->where('deleted_at', null)->where('tipoPersona', '2')->get();
        $query_denuncia_agraviado = DenunciaPersona::where('comisaria', $comisaria)->where('deleted_at', null)->where('tipoPersona', '3')->get();
        $query_denuncia_especie = DenunciaEspecie::where('comisaria', $comisaria)->where('deleted_at', null)->get();
        $query_denuncia_vehiculo = DenunciaVehiculo::where('comisaria', $comisaria)->where('deleted_at', null)->get();
        $data_arma = [];
        $data_denunciante = [];
        $data_denunciado = [];
        $data_agraviado = [];
        $data_especie = [];
        $data_vehiculo = [];
        foreach ($query_denuncia_denunciante as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciante[] = [
                'idDenuncia' => $item->idDenuncia,
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_denunciado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciado[] = [
                'idDenuncia' => $item->idDenuncia,
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_agraviado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_agraviado[] = [
                'idDenuncia' => $item->idDenuncia,
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_vehiculo as $item) {
            $query_vehiculo = Vehiculo::where('id', $item->idVehiculo)->get();
            $data_vehiculo[] = [
                'idDenuncia' => $item->idDenuncia,
                'placa' => $query_vehiculo[0]->placa,
                'full_name' => $query_vehiculo[0]->placa . ' ' . $query_vehiculo[0]->clase . ' ' . $query_vehiculo[0]->marca . ' ' . $query_vehiculo[0]->modelo,
            ];
        }

        foreach ($query_denuncia_arma as $item) {
            $query_arma = Arma::where('id', $item->idArma)->get();
            $data_arma[] = [
                'idDenuncia' => $item->idDenuncia,
                'id' => $query_arma[0]->id,
                'full_name' => $query_arma[0]->serie . ' ' . $query_arma[0]->marca . ' ' . $query_arma[0]->modelo . ' ' . $query_arma[0]->calibre,
                'serie' => $query_arma[0]->serie,
            ];
        }
        foreach ($query_denuncia_especie as $item) {
            $query_especie = Especie::where('id', $item->idEspecie)->get();
            $data_especie[] = [
                'idDenuncia' => $item->idDenuncia,
                'serie' => $query_especie[0]->serie,
                'full_name' => $query_especie[0]->serie . ' ' . $query_especie[0]->especie,
            ];
        }
        return response()->json(['status' => 'ok', 'data_vehiculo' => $data_vehiculo, 'data_especie' => $data_especie, 'data_agraviado' => $data_agraviado, 'data_arma' => $data_arma, 'data_denunciante' => $data_denunciante, 'data_denunciado' => $data_denunciado], 200);
    }
    public function complaint_detail_report_pdf(Request $request)
    {
        $data = $request->all();
        $id = $data["id"];
        $complaint = ViewComplaint::select("*")->where('id', $id)->get();
        $id_comisaria = auth()->user()->comisaria;
        $comisaria = Comisaria::select("*")->where('id', $id_comisaria)->get();
        $actual_date = date('Y-m-d h:i:s');
        $query_denuncia_arma = DenunciaArma::where('idDenuncia', $id)->where('deleted_at', null)->get();
        $query_denuncia_denunciante = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '1')->get();
        $query_denuncia_denunciado = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '2')->get();
        $query_denuncia_agraviado = DenunciaPersona::where('idDenuncia', $id)->where('deleted_at', null)->where('tipoPersona', '3')->get();
        $query_denuncia_especie = DenunciaEspecie::where('idDenuncia', $id)->where('deleted_at', null)->get();
        $query_denuncia_vehiculo = DenunciaVehiculo::where('idDenuncia', $id)->where('deleted_at', null)->get();

        $data_arma = [];
        $data_denunciante = [];
        $data_denunciado = [];
        $data_agraviado = [];
        $data_especie = [];
        $data_vehiculo = [];

        foreach ($query_denuncia_denunciante as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciante[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_denunciado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_denunciado[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_agraviado as $item) {
            $query_person = Persona::where('id', $item->idPersona)->get();
            $data_agraviado[] = [
                'dni' => $query_person[0]->dni,
                'full_name' => $query_person[0]->dni . ' ' . $query_person[0]->nombre . ' ' . $query_person[0]->ap_paterno . ' ' . $query_person[0]->ap_materno,
            ];
        }
        foreach ($query_denuncia_vehiculo as $item) {
            $query_vehiculo = Vehiculo::where('id', $item->idVehiculo)->get();
            $data_vehiculo[] = [
                'placa' => $query_vehiculo[0]->placa,
                'full_name' => $query_vehiculo[0]->placa . ' ' . $query_vehiculo[0]->clase . ' ' . $query_vehiculo[0]->marca . ' ' . $query_vehiculo[0]->modelo,
            ];
        }

        foreach ($query_denuncia_arma as $item) {
            $query_arma = Arma::where('id', $item->idArma)->get();
            $data_arma[] = [
                'id' => $query_arma[0]->id,
                'full_name' => $query_arma[0]->serie . ' ' . $query_arma[0]->marca . ' ' . $query_arma[0]->modelo . ' ' . $query_arma[0]->calibre,
                'serie' => $query_arma[0]->serie,
            ];
        }
        foreach ($query_denuncia_especie as $item) {
            $query_especie = Especie::where('id', $item->idEspecie)->get();
            $data_especie[] = [
                'serie' => $query_especie[0]->serie,
                'full_name' => $query_especie[0]->serie . ' ' . $query_especie[0]->especie,
            ];
        }
        $pdf = PDF::loadView('report/complaintDetailReport', ['data_vehiculo' => $data_vehiculo, 'data_arma' => $data_arma, 'data_especie' => $data_especie, 'data_agraviado' => $data_agraviado, 'data_denunciado' => $data_denunciado, 'data_denunciante' => $data_denunciante, 'actual_date' => $actual_date, 'complaint' => $complaint, 'comisaria' => $comisaria])->setPaper('a4', 'portrait');
        return $pdf->stream();
    }
    public function complaint_Reporte_pdf(Request $request)
    {
        $data = $request->all();
        $comisaria = auth()->user()->comisaria;
        if (isset($data["search"])) {
            $text_search = $data["search"];
            $complaints = ViewComplaint::select("*")
                ->where(function ($q) use ($text_search) {
                    $q->where('modality_description', 'like', '%' . $text_search . '%');
                    $q->orWhere('type_complaint_description', 'like', '%' . $text_search . '%');
                    $q->orWhere('seccion_description', 'like', '%' . $text_search . '%');
                    $q->orWhere('book_description', 'like', '%' . $text_search . '%');
                })
                ->where('comisaria', $comisaria)
                ->orderBy('id', 'desc')
                ->get();
        } else {
            $complaints = DB::table('view_denuncia')->where('comisaria', $comisaria)->orderBy('id', 'desc')->get();
        }
        $pdf = PDF::loadView('report/complaintReport', ['complaints' => $complaints])->setPaper('a4', 'landscape');
        return $pdf->stream();
    }
    public function complaint_Reporte_pdf_new(Request $request)
    {
        $data = $request->all();
        $filters = json_decode($data["filters"]);
        $modality = $filters->id_modalidad;
        $type_complaint = $filters->id_tipoDenuncia;
        $id_seccion = $filters->id_seccion;
        $id_libro = $filters->id_libro;
        $fecha_inicio = $filters->fecha_inicio;
        $fecha_fin = $filters->fecha_fin;
        $dni = $filters->dni;
        $array_id_complaints = [];
        $id_complaints = DenunciaPersona::select('denuncia_persona.idDenuncia')->join('persona', 'persona.id', '=', 'denuncia_persona.idPersona')->where('denuncia_persona.tipoPersona', '1')->where('persona.dni', $dni)->get();
        foreach ($id_complaints as $row) {
            $ids = $row->idDenuncia;
            array_push($array_id_complaints, $ids);
        }
        $data_complint = ViewComplaint::where('comisaria', auth()->user()->comisaria)
            ->where(function ($query) use ($array_id_complaints, $modality, $dni, $type_complaint, $id_seccion, $id_libro, $fecha_inicio, $fecha_fin) {
                if ($modality != '') {
                    $query->where('idModalidad', $modality);
                }
                if ($fecha_inicio != '' && $fecha_fin != '') {
                    $query->whereBetween('fechaHecho', [$fecha_inicio, $fecha_fin]);
                }
                if ($type_complaint != '') {
                    $query->where('tipoDenuncia', $type_complaint);
                }
                if ($id_seccion != '') {
                    $query->where('idSeccion', $id_seccion);
                }
                if ($id_libro != '') {
                    $query->where('idLibro', $id_libro);
                }
                if ($dni != '') {
                    $query->whereIn('id', $array_id_complaints);
                }
            })
            ->orderBy('id', 'desc')->get();

        $pdf = PDF::loadView('report/complaintReport', ['complaints' => $data_complint])->setPaper('a4', 'landscape');

        return $pdf->stream();
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
        try {
            $id_denuciante = config("constants.TYPE_PERSON.DENUCIANTE");
            $id_denunciado = config("constants.TYPE_PERSON.DENUNCIADO");
            $id_agraviado = config("constants.TYPE_PERSON.AGRAVIADO");

            DB::beginTransaction();

            $denunciantes = $request->input('denunciantes');
            $denunciados = $request->input('denunciados');
            $agraviados = $request->input('agraviados');
            $armas = $request->input('armas');
            $especies = $request->input('especies');
            $vehiculos = $request->input('vehiculos');

            $denuncia = Denuncia::findOrFail($id);
            $data = $request->all();
            $data['direccionHecho'] = mb_strtoupper($data['direccionHecho']);
            $data['descripcion'] = mb_strtoupper($data['descripcion']);

            $denuncia->update($data + ['comisaria' => auth()->user()->comisaria]);

            DenunciaPersona::where('idDenuncia', $id)->delete();
            DenunciaArma::where('idDenuncia', $id)->delete();
            DenunciaEspecie::where('idDenuncia', $id)->delete();
            DenunciaVehiculo::where('idDenuncia', $id)->delete();

            if (!empty($denunciantes)) {
                foreach ($denunciantes as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_denuciante,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($denunciados)) {
                foreach ($denunciados as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_denunciado,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($agraviados)) {
                foreach ($agraviados as $row) {
                    $dni = $row['dni'];
                    $persona = Persona::where('dni', $dni)->get()->first();
                    DenunciaPersona::create([
                        'idDenuncia' => $id,
                        'idPersona' => $persona->id,
                        'tipoPersona' => $id_agraviado,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($armas)) {
                foreach ($armas as $row) {
                    $serie = $row['serie'];
                    $arma = Arma::where('serie', $serie)->get()->first();
                    DenunciaArma::create([
                        'idDenuncia' => $id,
                        'idArma' => $arma->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };
            if (!empty($especies)) {
                foreach ($especies as $row) {
                    $serie = $row['serie'];
                    $especie = Especie::where('serie', $serie)->get()->first();
                    DenunciaEspecie::create([
                        'idDenuncia' => $id,
                        'idEspecie' => $especie->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };

            if (!empty($vehiculos)) {
                foreach ($vehiculos as $row) {
                    $placa = $row['placa'];
                    $vehiculo = Vehiculo::where('placa', $placa)->get()->first();
                    DenunciaVehiculo::create([
                        'idDenuncia' => $id,
                        'idVehiculo' => $vehiculo->id,
                        'comisaria' => auth()->user()->comisaria,
                    ]);
                }
            };

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
        $comisaria = Denuncia::findOrFail($id);
        $comisaria->delete();
        DenunciaArma::Where('idDenuncia', $id)->delete();
        DenunciaEspecie::Where('idDenuncia', $id)->delete();
        DenunciaPersona::Where('idDenuncia', $id)->delete();
        DenunciaVehiculo::Where('idDenuncia', $id)->delete();
        return 204;
    }
    public function data_dashboard()
    {
        $comisaria = auth()->user()->comisaria;
        $array_moth = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Obtubre', 'noviembre', 'Diciembre'];
        $actual_date = date('Y-m-d');
        $total_complaint_date = Denuncia::select(DB::raw('count(id) as `data`'), DB::raw('MONTH(created_at) month'))->where('comisaria', $comisaria)->whereYear('created_at', '=', date('Y'))->groupby('month')->get();
        $total_complaint_date_year = Denuncia::select(DB::raw('count(id) as `data`'), DB::raw('YEAR(created_at) year'))->where('comisaria', $comisaria)->groupby('year')->get();

        $total_complaint_modality = Denuncia::select(DB::raw('count(denuncia.id) as `data`'), DB::raw('modalidad.descripcion as `modality`'), DB::raw('modalidad.color_report as `color_report`'))->join('modalidad', 'modalidad.id', '=', 'denuncia.idModalidad')->where('denuncia.comisaria', $comisaria)->groupby('denuncia.idModalidad', 'modalidad.descripcion', 'modalidad.color_report')->get();



        $array_data_for_month = [];
        $array_month_for_month = [];
        $array_data_for_year = [];
        $array_year = [];

        $array_color_modality = [];
        $array_data_modality = [];
        $array_name_modality = [];

        foreach ($total_complaint_modality as $row) {
            $color = $row->color_report;
            $data_modality = $row->data;
            $name_modality = $row->modality;
            array_push($array_color_modality, $color);
            array_push($array_data_modality, $data_modality);
            array_push($array_name_modality, $name_modality);
        }
        foreach ($total_complaint_date as $row) {
            $cant = $row->data;
            $number_month = $row->month;
            $string_month = $array_moth[$number_month];
            array_push($array_data_for_month, $cant);
            array_push($array_month_for_month, $string_month);
        }
        foreach ($total_complaint_date_year as $row) {
            $cant = $row->data;
            $year = $row->year;
            array_push($array_data_for_year, $cant);
            array_push($array_year, $year);
        }
        $total_complaint = Denuncia::where('comisaria', $comisaria)->count();
        $total_complaint_day = Denuncia::where('comisaria', $comisaria)->where('created_at', '=', date('Y-m-d'))->count();

        $total_complaint_arma = DenunciaArma::where('comisaria', $comisaria)->count();
        $total_complaint_day_arma = DenunciaArma::where('comisaria', $comisaria)->where('created_at', '=', date('Y-m-d'))->count();

        $total_complaint_especie = DenunciaEspecie::where('comisaria', $comisaria)->count();
        $total_complaint_day_especie = DenunciaEspecie::where('comisaria', $comisaria)->where('created_at', '=', date('Y-m-d'))->count();

        $total_complaint_vehiculo = DenunciaVehiculo::where('comisaria', $comisaria)->count();
        $total_complaint_day_vehiculo = DenunciaVehiculo::where('comisaria', $comisaria)->where('created_at', '=', date('Y-m-d'))->count();



        return response()->json([
            'status' => 'ok',

            'total_complaint' => $total_complaint,
            'total_complaint_day' => $total_complaint_day,

            'total_complaint_arma' => $total_complaint_arma,
            'total_complaint_day_arma' => $total_complaint_day_arma,

            'total_complaint_especie' => $total_complaint_especie,
            'total_complaint_day_especie' => $total_complaint_day_especie,

            'total_complaint_vehiculo' => $total_complaint_vehiculo,
            'total_complaint_day_vehiculo' => $total_complaint_day_vehiculo,
            'total_complaint_data_months' => $array_data_for_month,
            'total_complaint_months_months' => $array_month_for_month,

            'array_data_for_year' => $array_data_for_year,
            'array_year' => $array_year,
            'total_complaint_modality' => $total_complaint_modality,

            'array_color_modality' => $array_color_modality,
            'array_data_modality' => $array_data_modality,
            'array_name_modality' => $array_name_modality,

        ], 200);
    }
}
