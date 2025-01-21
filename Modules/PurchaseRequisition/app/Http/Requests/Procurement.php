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
            'vendors.*.units.*.uom' => 'required|string',
            'vendors.*.units.*.qty' => 'required|numeric|min:1',
            'vendors.*.units.*.unit_price' => 'required|numeric|min:0',
            'vendors.*.units.*.total_amount' => 'required|numeric|min:0',
            'vendors.*.units.*.tax' => 'required|string',
            'vendors.*.units.*.short_text' => 'nullable|string|max:255',
            'attachment' => 'required|array',
        ];
    }

    /**
     * Get the validation messages for the rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'user_id.required' => 'User ID is required.',
            'user_id.integer' => 'User ID must be an integer.',
            'user_id.exists' => 'User ID must exist in the users table.',
            'document_type.required' => 'Document type is required.',
            'purchasing_groups.required' => 'Purchasing groups are required.',
            'delivery_date.required' => 'Delivery date is required.',
            'storage_locations.required' => 'Storage locations are required.',
            'total_vendor.required' => 'Total vendor is required.',
            'vendors.required' => 'Vendors are required.',
            'vendors.array' => 'Vendors must be an array.',
            'vendors.*.vendor.required' => 'Vendor ID is required in each vendor.',
            'vendors.*.vendor.integer' => 'Vendor ID must be an integer.',
            'vendors.*.units.required' => 'Item are required in each vendor.',
            'vendors.*.units.array' => 'Item must be an array in each vendor.',
            'vendors.*.units.*.material_group.required' => 'Material group is required in each unit.',
            'vendors.*.units.*.uom.required' => 'Unit of measure (UOM) is required in each unit.',
            'vendors.*.units.*.qty.required' => 'Quantity is required in each unit.',
            'vendors.*.units.*.qty.numeric' => 'Quantity must be a number in each unit.',
            'vendors.*.units.*.qty.min' => 'Quantity must be at least 1 in each unit.',
            'vendors.*.units.*.unit_price.required' => 'Unit price is required in each unit.',
            'vendors.*.units.*.unit_price.numeric' => 'Unit price must be a number in each unit.',
            'vendors.*.units.*.unit_price.min' => 'Unit price must be at least 0 in each unit.',
            'vendors.*.units.*.total_amount.required' => 'Total amount is required in each unit.',
            'vendors.*.units.*.total_amount.numeric' => 'Total amount must be a number in each unit.',
            'vendors.*.units.*.total_amount.min' => 'Total amount must be at least 0 in each unit.',
            'vendors.*.units.*.tax.required' => 'Tax is required in each unit.',
            'vendors.*.units.*.short_text.max' => 'Short text must not exceed 255 characters in each unit.',
            'attachment.required' => 'Please Input The File.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Memastikan ada vendor dengan `winner` bernilai true
            $hasWinner = collect($this->vendors)->contains(function ($vendor) {
                return isset($vendor['winner']) && $vendor['winner'] === true;
            });

            if (!$hasWinner) {
                $validator->errors()->add('vendors', 'At least one vendor must be marked as the winner.');
            }
        });
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
        $errorMessage = $errors->all(); // Mendapatkan semua pesan error sebagai array
        $errorString = implode(', ', $errorMessage); // Menggabungkan array menjadi string

        // Menampilkan pesan error dalam bentuk JSON
        throw new HttpResponseException(response()->json([
            'status' => 'error',
            'message' => $errorString,
            'errors' => null
        ], 422));
    }
}
