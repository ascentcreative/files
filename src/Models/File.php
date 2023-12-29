<?php

namespace AscentCreative\Files\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Storage;

use Symfony\Component\HttpFoundation\BinaryFileResponse;

class File extends Model
{
    use HasFactory;

    public $table = 'files_files';

    public $fillable = ['disk', 'hashed_filename', 'original_filename', 'mime_type', 'size', 'attachedto_type', 'attachedto_id', 'attachedto_key', 'attachedto_sort'];


    protected static function booted() {
        // delete on-disk file
        static::deleted(function ($model) {
            // ** TODO: Need a check that no other file records point to the same on-disk file
            // ** and only delete where safe to do so.
            Storage::disk($model->disk)->delete($model->hashed_filename);
        });
    }

    public function attachedto() {
        return $this->morphTo();
    }

    public function download() {

        activity('files')
            ->on($this)
            ->event('download')
            ->log('download');

        /**
         * Should we add a policy check here? or does that hogtie us?
         */

        if(env('X_LITESPEED') == 1) {
            return response()->xlitespeed(Storage::disk($this->disk)->path($this->hashed_filename), $this->original_filename); 
        }

        return Storage::disk($this->disk)->download($this->hashed_filename, $this->original_filename);

    }

   
    public function stream() {

        /** 
         * NB - stream logging is problematic as it may be requested multiple times (byte ranges) or never (cached) 
         * Suggest that logging of user interactions for streams would be better done as an AJAX call in the player
         */
        // activity('files')
        //     ->on($this)
        //     ->event('stream')
        //     ->log('stream');

        // LITESPEED can handle all the streaming for us
        if(env('X_LITESPEED') == 1) {
            return response()->xlitespeed(Storage::disk($this->disk)->path($this->hashed_filename), $this->original_filename); 
        }

        // Otherwise, fallback to Symfony's handler
        // Any reason we can't use this for general stuff?
        $file = Storage::disk($this->disk)->path($this->hashed_filename);
        $response = new BinaryFileResponse($file);
        return $response;

    }


    public function getSizeHumanAttribute() {

        $dec = 1;
        $bytes = $this->size > 0 ? $this->size : Storage::disk($this->disk)->filesize($this->hashed_filename);
        $size   = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
        $factor = floor((strlen($bytes) - 1) / 3);

        return sprintf("%.{$dec}f", $bytes / pow(1024, $factor)) . @$size[$factor];

    }


    public function getMediaTypeAttribute() {

        $split = explode('/', $this->mime_type);
        $stub = $split[0];

        switch ($stub) {

            case 'audio':
            case 'image':
                return $stub;
                break;

            default:
                return 'other';
                break;

        }

    }

}
