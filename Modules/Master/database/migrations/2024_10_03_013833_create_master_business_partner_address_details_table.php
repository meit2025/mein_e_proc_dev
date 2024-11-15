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
        Schema::create('master_business_partner_address_details', function (Blueprint $table) {
            $table->id();
            $table->string('building')->nullable();            // Building (Number or Code)
            $table->string('city');                           // City
            $table->string('district')->nullable();           // District
            $table->string('country_key');                     // Country/Region Key
            $table->string('fax_extension')->nullable();       // First fax no.: extension
            $table->string('fax_number')->nullable();          // First Fax No.: Area Code + Number
            $table->string('floor')->nullable();               // Floor in building
            $table->string('postal_city')->nullable();        // City (different from postal city)
            $table->string('language_key')->nullable();        // Language Key
            $table->string('street_5')->nullable();           // Street 5
            $table->string('co_name')->nullable();            // c/o name
            $table->string('postal_code')->nullable();         // City postal code
            $table->string('po_box_postal_code')->nullable();  // PO Box Postal Code
            $table->string('company_postal_code')->nullable(); // Company Postal Code (for Large Customers)
            $table->string('po_box')->nullable();              // PO Box
            $table->string('region')->nullable();              // Region (State, Province, County)
            $table->string('room_number')->nullable();         // Room or Apartment Number
            $table->string('street');
            $table->string('street_two')->nullable();           // Street 2
            $table->string('street_three')->nullable();           // Street 3
            $table->string('street_four')->nullable();           // Street 4
            $table->string('phone_extension')->nullable();     // First Telephone No.: Extension
            $table->string('phone_number')->nullable();        // First Telephone No.: Dialing Code + Number
            $table->string('email')->nullable();              // E-Mail Address
            $table->string('communication_valid_from')->nullable(); // Communication Data: Valid From (YYYYMMDDHHMMSS)
            $table->string('communication_valid_to')->nullable();   // Communication Data: Valid To (YYYYMMDDHHMMSS)
            $table->string('partner_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_business_partner_address_details');
    }
};
