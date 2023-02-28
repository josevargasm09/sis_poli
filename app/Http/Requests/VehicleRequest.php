<?php


namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class VehicleRequest extends FormRequest
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
            'placa' => 'required|unique:vehiculo,placa,' . $this->id.',id,deleted_at,NULL',
            'clase' => 'required',
            'situacion' => 'required',
            'marca' => 'required',
            'modelo' => 'required',
            'estado' => 'required',
        ];
    }
    public function messages()
    {
        return [
            'placa.unique' => 'Ya existe un vehiculo con ese número de placa',
            'clase.required' => 'Debe ingresar clase',
            'situacion.required' => 'Debe ingresar situacion',
            'marca.required' => 'Debe ingresar marca',
            'modelo.required' => 'Debe ingresar modelo',
            'estado.required' => 'Debe ingresar estado',
            'placa.required' => 'Debe ingresar placa',

        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
