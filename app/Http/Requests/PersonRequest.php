<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
class PersonRequest extends FormRequest
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
            'dni'=>'required|size:8|unique:persona,dni,'. $this->id.',id,deleted_at,NULL',
            'celular'=>'required|max:9',
            'nombre'=>'required',
            'ap_paterno'=>'required',
            'ap_materno'=>'required',
            'edad'=>'required',
            'sexo'=>'required',
            'celular'=>'required',
            'estado_civil'=>'required',

        ];
    }
    public function messages()
    {
        return[
            'nombre.required'=>'Debe ingresar nombre',
            'ap_paterno.required'=>'Debe ingresar apellido paterno',
            'ap_materno.required'=>'Debe ingresar apellido materno',
            'edad.required'=>'Debe ingresar edad',
            'sexo.required'=>'Debe ingresar sexo',
            'celular.required'=>'Debe ingresar celular',
            'estado_civil.required'=>'Debe ingresar estado civil',
            'dni.size'=>'El dni debe de tener 8 digitos',
            'celular.max'=>'El celular debe de tener máximo 9 digitos',
            'dni.unique'=>'Ya existe una persona con ese número de dni',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
