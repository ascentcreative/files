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
        // the products
        Schema::create('files_files', function(Blueprint $table) {
            
            $table->id();

            $table->string('disk', '20')->index();
            // $table->string('path', '200')->index();
            $table->string('hashed_filename')->index();
            $table->string('original_filename')->index();

            $table->string('mime_type', 50);
            
            $table->string('attachedto_type');
            $table->bigInteger('attachedto_id');
            $table->string('attachedto_key');
            $table->integer('attachedto_sort');

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
        //
        Schema::drop('files_files');

    }
};
