<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'rounds' => ['required', 'array', 'min:1'],
            'rounds.*.survey_id' => ['required', 'integer', 'exists:surveys,id'],
            'rounds.*.multiplier' => ['required', 'integer', 'min:1', 'max:5'],
            'rounds.*.round_order' => ['required', 'integer', 'min:1', 'max:10', 'distinct'],
            'configuration_json' => ['nullable', 'array'],
        ];
    }
}
