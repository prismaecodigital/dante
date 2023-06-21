<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code')->nullable()->unique();
            $table->string('jenis_order')->nullable();
            $table->datetime('date');
            $table->string('customer')->nullable();
            $table->string('address')->nullable();
            $table->string('complaint')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }
}