<?php

namespace AscentCreative\Files\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Storage;


class File extends Model
{
    use HasFactory;

    public $table = 'files_files';

    public $fillable = ['disk', 'hashed_filename', 'original_filename', 'mime_type', 'attachedto_type', 'attachedto_id', 'attachedto_key', 'attachedto_sort'];

    public function attachedto() {
        return $this->morphTo();
    }


    public function download() {

        /**
         * Should we add a policy check here? or does that hogtie us?
         */

        if(env('X_LITESPEED') == 1) {
            return response()->xlitespeed(Storage::disk($this->disk)->path($this->hashed_filename), $this->original_filename); 
        }

        return Storage::disk($this->disk)->download($this->hashed_filename, $this->original_filename);

    }

}
