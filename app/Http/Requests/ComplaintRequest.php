<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class ComplaintRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'idModalidad'=>'required',
        
            'tipoDenuncia'=>'required',

            'idSeccion'=>'required',
            'idLibro'=>'required',
            'formalidad'=>'required',
            'fechaHecho'=>'required',
            'horaHecho'=>'required',

            'lugarHecho'=>'required',
            'direccionHecho'=>'required',
            'latitudHecho'=>'required',
            'longitudHecho'=>'required',

            'descripcion'=>'required',
            
        ];
    }
    public function messages()
    {
        return[
            'idModalidad.required'=>'Debe ingresar modalidad',

            'tipoDenuncia.required'=>'Debe ingresar tipo denuncia',

            'idSeccion.required'=>'Debe ingresar seccion',

            'idLibro.required'=>'Debe ingresar libro',

            'formalidad.required'=>'Debe ingresar formalidad',

            'fechaHecho.required'=>'Debe ingresar fecha',

            'horaHecho.required'=>'Debe ingresar hora',

            'lugarHecho.required'=>'Debe ingresar distrito',

            'direccionHecho.required'=>'Debe ingresar direccion',

            'descripcion.required'=>'Debe ingresar descripción',

        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
