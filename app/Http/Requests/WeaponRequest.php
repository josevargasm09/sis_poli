<?php

namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
class WeaponRequest extends FormRequest
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
            'serie'=>'required|unique:arma,serie,'.$this->id.',id,deleted_at,NULL',
            'marca'=>'required',
            'modelo'=>'required',
            'calibre'=>'required',
            'estado'=>'required',
        ];
    }
    public function messages()
    {
        return[
            'serie.unique'=>'Ya existe un arma con ese número de serie',
            'marca.required'=>'Debe ingresar marca',
            'modelo.required'=>'Debe ingresar modelo',
            'calibre.required'=>'Debe ingresar calibre',
            'serie.required'=>'Debe ingresar serie',
            'estado.required'=>'Debe ingresar estado',
            
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }

}
