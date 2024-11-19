<?php

namespace Modules\PurchaseRequisition\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class Procurement extends FormRequest
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
            'user_id' => 'required|integer|exists:users,id',
            'document_type' => 'required|string|max:255',
            'purchasing_groups' => 'required|string|max:10',
            'delivery_date' => 'required|date',
            'storage_locations' => 'required|string|max:4',
            'total_vendor' => 'required|integer|min:1',
            'vendors' => 'required|array',
            'vendors.*.vendor' => 'required|integer', // Assuming vendors table has an 'id' field
            'vendors.*.units' => 'required|array',
            'vendors.*.units.*.material_group' => 'required|string|max:255',
            'vendors.*.units.*.uom' => 'required|string|max:10',
            'vendors.*.units.*.qty' => 'required|numeric|min:1',
            'vendors.*.units.*.unit_price' => 'required|numeric|min:0',
            'vendors.*.units.*.total_amount' => 'required|numeric|min:0',
            'vendors.*.units.*.tax' => 'required|string|max:10',
            'vendors.*.units.*.short_text' => 'nullable|string|max:255',
        ];
    }

    /**
     * Get the validation messages for the rules.
     *
     * @return array
     */
    public function messages()
    {
        return [];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  Validator  $validator
     * @return void
     *
     * @throws HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        // Menampilkan pesan error dalam bentuk JSON
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errors
        ], 422));
    }
}
