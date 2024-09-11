<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateServiceRequest extends FormRequest
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
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'upcoming_service' => ['required'],
            'customer' => ['required', 'string'],
            'address' => ['required', 'string'],
            'service' => ['required', 'string'],
            'latest_service' => ['required'],
            'status' => ['required']
        ];
    }
}
