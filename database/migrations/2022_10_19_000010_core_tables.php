<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CoreTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // the products
        Schema::create('images_images', function(Blueprint $table) {
            
            $table->id();

            $table->string('disk', '20')->index();
            // $table->string('path', '200')->index();
            $table->string('hashed_filename')->index();
            $table->string('original_filename')->index();

            $table->string('mime_type', 50);
            
            $table->string('imageable_type');
            $table->bigInteger('imageable_id');
            $table->string('imageable_key');
            $table->integer('imageable_sort');

            $table->timestamps();
            
        });


        // Schema::create('images_outputspecs', function(Blueprint $table) {

        //     $table->id();
        //     $table->string('title', 50)->nullable();
        //     $table->string('slug')->nullable()->index();
        //     $table->integer('width')->nullable();
        //     $table->integer('height')->nullable();
        //     $table->tinyinteger('preserve_aspect')->default(1);
        //     $table->tinyinteger('auto_crop')->default(1);
        //     $table->float('quality')->nullable()->default(85);
        //     $table->timestamps();
           
        // });

    
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::drop('images_images');
        // Schema::drop('images_outputspecs');
    }
}
