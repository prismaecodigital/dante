<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('jenis_pekerjaan');
            $table->string('lokasi')->nullable();
            $table->integer('qty')->nullable();
            $table->string('satuan')->nullable();
            $table->integer('price');
            $table->string('ket');
            $table->foreignId('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->timestamps();
        });
    }
}