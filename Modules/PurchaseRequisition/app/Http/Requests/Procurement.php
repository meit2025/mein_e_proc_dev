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
            'const_center' => 'required',
            'cost_center_budgeted' => 'string',
            'transaction_budgeted' => 'string',
            'vendor_remark' => 'string',
            'vendor_selected_competitive_lowest_price' => 'boolean',
            'vendor_selected_competitive_price' => 'boolean',
            'vendor_selected_competitive_capable' => 'boolean',
            'selected_vendor_remark' => 'string',
            'item' => 'required|array',
            'item.*.material_number' => 'required|string',
            'item.*.qty' => 'required|integer',
            'vendor' => 'required|array',
            'vendor.*.vendor' => 'required',
            'vendor.*.vendor_winner' => 'boolean',
            'vendor.*.unit' => 'required|array',
            'vendor.*.unit.*.unit_price' => 'required|numeric',
            'vendor.*.unit.*.total_amount' => 'required|numeric',
            'vendor.*.unit.*.other_criteria' => 'required',
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
