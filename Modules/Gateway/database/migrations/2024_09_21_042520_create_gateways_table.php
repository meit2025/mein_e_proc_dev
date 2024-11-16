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
        Schema::create('gateways', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("tabel_name");
            $table->enum('methods', ['get', 'post']);
            $table->enum("type", ['get', 'create', 'update', 'createOrUpdate']);
            $table->enum('authentication', ['key', 'jwt']);
            $table->string('desc')->nullable();
            $table->text('command');
            $table->boolean('is_status');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gateways');
    }
};
