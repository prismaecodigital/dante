<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_ac', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->string('lokasi')->nullable();
            $table->string('ampere_sebelum')->nullable();
            $table->string('ampere_sesudah')->nullable();
            $table->string('voltase_sebelum')->nullable();
            $table->string('voltase_sesudah')->nullable();
            $table->string('refrigen_sebelum')->nullable();
            $table->string('refrigen_sesudah')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_ac');
    }
};
