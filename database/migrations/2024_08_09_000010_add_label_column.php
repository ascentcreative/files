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
     
        Schema::table('files_files', function(Blueprint $table) {
        
            $table->string('label')->after('original_filename')->nullable();
           
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
        Schema::table('files_files', function(Blueprint $table) {
        
            $table->dropColumn('label');
           
        });

    }
};
