<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSurveyRequest extends FormRequest
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
            'question' => ['required', 'string', 'max:255'],
            'is_public' => ['nullable', 'boolean'],
            'approved' => ['nullable', 'boolean'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.answer' => ['required', 'string', 'max:255'],
            'answers.*.frequency' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }
}
