<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
class UserRequest extends FormRequest
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
            'idperfil'=>'required',
            'dni'=>'required|size:8|unique:users,dni,' . $this->id.',id,deleted_at,NULL,comisaria,'.auth()->user()->comisaria,
            'name'=>'required',
            'celular'=>'required|max:9',
            'apellido'=>'required',
            'usuarioCip'=>'required|size:7|unique:users,usuarioCip,' . $this->id.',id,deleted_at,NULL,comisaria,'.auth()->user()->comisaria,
            'email'=>'required|unique:users,email,' . $this->id.',id,deleted_at,NULL,comisaria,'.auth()->user()->comisaria,
            'celular'=>'required',
            'password'=>'required',
        ];
    }
    public function messages()
    {
        return[
            'dni.unique'=>'Ya existe un usuario con ese número de dni',
            'email.unique'=>'Ya existe un usuario con ese correo',
            'idperfil.required'=>'Debe ingresar perfil',
            'name.required'=>'Debe ingresar nombre',
            'dni.required'=>'Debe ingresar dni',
            'apellido.required'=>'Debe ingresar apellido',
            'usuarioCip.required'=>'Debe ingresar usuario cip',
            'email.required'=>'Debe ingresar email',
            'sexo.required'=>'Debe ingresar sexo',
            'celular.required'=>'Debe ingresar celular',
            'dni.size'=>'El dni debe de tener 8 digitos',
            'celular.max'=>'El celular debe de tener máximo 9 digitos',
            'usuarioCip.size'=>'El usuario cip debe tener 7 digitos',
            'password.required'=>'Debe ingresar contraseña'
            
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
