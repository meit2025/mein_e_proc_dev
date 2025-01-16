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


        if (!Schema::hasTable('reimburse_groups')) {
            Schema::create('reimburse_groups', function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique();
                $table->longText('remark');
                $table->string('requester');
                $table->foreignId('cost_center')->constrained('master_cost_centers')->cascadeOnUpdate();
                $table->softDeletes();
                $table->timestamps();

                $table->foreign('requester')->references('nip')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reimburse_groups');
    }
};
