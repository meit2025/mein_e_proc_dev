<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_business_partner_banks', function (Blueprint $table) {
            $table->id();
            $table->string('bank_key')->nullable();              // Bank Keys
            $table->string('bank_account_number');               // Bank Account Number
            $table->string('bank_country_key');                  // Bank Country/Region Key
            $table->string('external_bank_details_id')->nullable(); // Bank details ID in external system
            $table->string('bank_control_key')->nullable();      // Bank Control Key
            $table->string('reference_details')->nullable();    // Reference Details for Bank Details
            $table->string('bank_details_id');                   // Bank Details ID
            $table->string('validity_start')->nullable();              // Validity Start of Business Partner Bank Details
            $table->string('validity_end')->nullable();                // Validity End of Business Partner Bank Details
            $table->string('dummy_function', 1)->nullable();         // Dummy function in length 1
            $table->string('bank_account_check_digit', 10)->nullable(); // Bank Account Check Digit
            $table->string('iban', 34)->nullable();                  // IBAN (International Bank Account Number)
            $table->string('account_holder_name');              // Account Holder Name
            $table->boolean('collection_authorization')->default(false); // Indicator: Collection Authorization
            $table->string('partner_number');                    // Business Partner Number (Foreign Key)




            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partner_banks');
    }
};
