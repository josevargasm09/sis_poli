<?php

namespace App\Http\Requests;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class EspecieRequest extends FormRequest
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
            'serie'=>'required|unique:especie,serie,' . $this->id.',id,deleted_at,NULL',
            'especie'=>'required',
            'situacion'=>'required',
            'documento'=>'required',
            'codigoDoc'=>'required',
            'estado'=>'required',
        ];
    }
    public function messages()
    {
        return[
            'serie.unique'=>'Ya existe una especie con ese número de serie',
            'serie.required'=>'Debe ingresar serie',
            'especie.required'=>'Debe ingresar especie',
            'situacion.required'=>'Debe ingresar situacion',
            'documento.required'=>'Debe ingresar documento',
            'codigoDoc.required'=>'Debe ingresar codigo documento',
            'estado.required'=>'Debe ingresar estado',
            
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
