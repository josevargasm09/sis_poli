<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\ComisariaController;
use App\Http\Controllers\ArmaController;
use App\Http\Controllers\EspecieController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PdfController;

use App\Http\Controllers\ModalityController;

use App\Http\Controllers\LibroController;
use App\Http\Controllers\SeccionController;
use App\Http\Controllers\UbigeoController;
use App\Http\Controllers\DenunciaController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', [AuthController::class, 'login']);
Route::get('/list_modulos/{id}', [AuthController::class, 'list_modulos']);

Route::get('/perfil_edit/{id}', [PerfilController::class, 'edit']);

Route::middleware('auth:sanctum')->group(function () {
    // Route::post('/infouser',[AuthController::class,'infouser']);
    Route::get('/logout', [AuthController::class, 'logout']);
    
    // Route::post('/register',[AuthController::class,'register']);

    //Perfil

    Route::get('/perfil', [PerfilController::class, 'index']);
    Route::post('/perfilC', [PerfilController::class, 'store']);
    Route::put('/perfilU/{id}', [PerfilController::class, 'update']);
    Route::delete('/perfilD/{id}', [PerfilController::class, 'destroy']);
    ///Usuario
    Route::get('/usuario', [UserController::class, 'index']);
    Route::post('/usuarioC', [UserController::class, 'store']);
    Route::put('/usuarioU/{id}', [UserController::class, 'update']);
    Route::delete('/usuarioD/{id}', [UserController::class, 'destroy']);
    Route::get('/getPerfil', [PerfilController::class, 'getPerfil']);


    //  Comisaria
    Route::get('/comisaria', [ComisariaController::class, 'index']);
    Route::post('/comisariaC', [ComisariaController::class, 'store']);
    Route::put('/comisariaU/{id}', [ComisariaController::class, 'update']);
    Route::delete('/comisariaD/{id}', [ComisariaController::class, 'destroy']);
    Route::get('/getComisaria', [ComisariaController::class, 'getComisaria']);
    // Arma
    Route::get('/arma', [ArmaController::class, 'index']);
    Route::post('/armaC', [ArmaController::class, 'store']);
    Route::put('/armaU/{id}', [ArmaController::class, 'update']);
    Route::delete('/armaD/{id}', [ArmaController::class, 'destroy']);
    Route::get('/getArma', [ArmaController::class, 'getArma']);
    Route::get('/get_arma_search', [ArmaController::class, 'get_arma_search']);

    // Vehiculo

    Route::get('/vehiculo', [VehiculoController::class, 'index']);
    Route::post('/vehiculoC', [VehiculoController::class, 'store']);
    Route::put('/vehiculoU/{id}', [VehiculoController::class, 'update']);
    Route::delete('/vehiculoD/{id}', [VehiculoController::class, 'destroy']);
    Route::get('/getVehiculo', [VehiculoController::class, 'getVehiculo']);
    Route::get('/get_vehiculo_search', [VehiculoController::class, 'get_vehiculo_search']);

    // Especie

    Route::get('/especie', [EspecieController::class, 'index']);
    Route::post('/especieC', [EspecieController::class, 'store']);
    Route::put('/especieU/{id}', [EspecieController::class, 'update']);
    Route::delete('/especieD/{id}', [EspecieController::class, 'destroy']);
    Route::get('/getEspecie', [EspecieController::class, 'getEspecie']);
    Route::get('/get_especie_search', [EspecieController::class, 'get_especie_search']);


    // persona
    Route::get('/get_person_search', [PersonaController::class, 'get_person_search']);
    Route::get('/persona', [PersonaController::class, 'index']);
    Route::post('/personaC', [PersonaController::class, 'store']);
    Route::put('/personaU/{id}', [PersonaController::class, 'update']);
    Route::delete('/personaD/{id}', [PersonaController::class, 'destroy']);
    Route::get('/getPersona', [PersonaController::class, 'getPersona']);

    // Reporte
    Route::get('/reporte', [ReporteController::class, 'index']);
    Route::post('/reporteC', [ReporteController::class, 'store']);
    Route::put('/reporteU/{id}', [ReporteController::class, 'update']);
    Route::delete('/reporteD/{id}', [ReporteController::class, 'destroy']);
    Route::get('/getReporte', [ReporteController::class, 'getReporte']);

    // Module
    Route::get('/getModule', [ModuleController::class, 'getModule']);


    // Modality
    Route::get('/modality_active', [ModalityController::class, 'modality_active']);
    Route::get('/modality_list', [ModalityController::class, 'index']);
    Route::post('/modality_create', [ModalityController::class, 'store']);
    Route::put('/modality_update/{id}', [ModalityController::class, 'update']);
    Route::delete('/modality_delete/{id}', [ModalityController::class, 'destroy']);
    // libro
    
    Route::get('/book_active', [LibroController::class, 'book_active']);
    Route::get('/libro', [LibroController::class, 'index']);
    Route::post('/libroC', [LibroController::class, 'store']);
    Route::put('/libroU/{id}', [LibroController::class, 'update']);
    Route::delete('/libroD/{id}', [LibroController::class, 'destroy']);
    Route::get('/getLibro', [LibroController::class, 'getLibro']);

    // Secciones
    Route::get('/seccion_active', [SeccionController::class, 'seccion_active']);
    Route::get('/seccion', [SeccionController::class, 'index']);
    Route::post('/seccionC', [SeccionController::class, 'store']);
    Route::put('/seccionU/{id}', [SeccionController::class, 'update']);
    Route::delete('/seccionD/{id}', [SeccionController::class, 'destroy']);
    Route::get('/getSeccion', [SeccionController::class, 'getSeccion']);

    //Ubigeo
    Route::get('/list_ubigeo', [UbigeoController::class, 'index']);
    Route::get('/list_departamento', [UbigeoController::class, 'list_departamento']);
    Route::get('/list_provincia/{id}', [UbigeoController::class, 'list_provincia']);
    //Denuncia
    Route::post('/denuncia_create', [DenunciaController::class, 'store']);
    Route::put('/denuncia_update/{id}', [DenunciaController::class, 'update']);
    Route::get('/denuncia', [DenunciaController::class, 'index']);
    Route::delete('/Denuncia_delete/{id}', [DenunciaController::class, 'destroy']);
    Route::get('/denuncia_detail/{id}', [DenunciaController::class, 'detail_complaint']);

    Route::get("report_modality_pdf", [ModalityController::class, "report_modality_pdf"]);
    Route::get("complaint_Reporte_pdf", [DenunciaController::class, "complaint_Reporte_pdf"]);

    Route::get("reporte-pdf", [PdfController::class, "indexPdf"]);
    Route::get("reporteComisaria-pdf", [ComisariaController::class, "indexComiPdf"]);


    Route::get("reportePerson-pdf", [PersonaController::class, "indexPersonPdf"]);


    Route::get("reporteEspecie-pdf", [EspecieController::class, "indexEspePdf"]);


    Route::get("reporteVehiculo-pdf", [VehiculoController::class, "indexVehiPdf"]);


    Route::get("reporteArma-pdf", [ArmaController::class, "indexArmaPdf"]);

    Route::get("reporteUsers-pdf", [UserController::class, "indexUserPdf"]);

    Route::get("reportePerfil-pdf", [PerfilController::class, "indexPerfilPdf"]);

    Route::get('/libroReporte-pdf', [LibroController::class, 'indexLibroPdf']);

    Route::get('/seccionReporte-pdf', [SeccionController::class, 'indexSeccionPdf']);

    Route::get('/complaint_list_report', [DenunciaController::class, 'complaint_list_report']);

    Route::get("complaint_Reporte_pdf_new", [DenunciaController::class, "complaint_Reporte_pdf_new"]);

    Route::get("complaint_detail_report_pdf", [DenunciaController::class, "complaint_detail_report_pdf"]);

    Route::get("complaint_detail_total", [DenunciaController::class, "complaint_detail_total"]);

    

    Route::get('/data_dashboard', [DenunciaController::class, 'data_dashboard']);
    });
