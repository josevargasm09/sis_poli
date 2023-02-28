<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class ComisariaRequest extends FormRequest
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
            'nom_comisaria'=>'required',
            'direccion'=>'required',
            'phone'=>'required',
            'email'=>'required',
        ];
    }
    public function messages()
    {
        return[
            'nom_comisaria.required'=>'Debe ingresar comisaría',
            'direccion.required'=>'Debe ingresar Dirección',
            'phone.required'=>'Debe ingresar teléfono',
            'email.required'=>'Debe ingresar correo',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
