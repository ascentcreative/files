<?php

namespace AscentCreative\Files\Traits;

use AscentCreative\CMS\Traits\Extender;
use AscentCreative\Files\Models\File;

use Illuminate\Http\Request;

/**
 * [Description HasFiles]
 * Allows fields to be specified as being files (single or multiple) which will be captured and processed by this trait.
 */
trait HasFiles {

    use Extender;

    public function initializeHasFiles() {

        if(is_array($this->multifile_fields)) {
            foreach($this->multifile_fields as $file) {
               $this->addCapturable($file, 'deleteMultiFiles', 'saveMultiFiles');
            }
        }

        if(is_array($this->singlefile_fields)) {
            foreach($this->singlefile_fields as $file) {
               $this->addCapturable($file, 'deleteSingleFile', 'saveSingleFile');
            }
        }

    }



    public function saveSingleFile($field, $data) {

        if($data) {

            $stored = $this->file($field)->first();

            if ($stored && $stored->id != ($data['id'] ?? '')) {
                $stored->delete();
                // dd('dleeted')
            } 
        
            $file = $this->file($field)->updateOrCreate(
                [
                    'id'=>$data['id'] ??  null,
                    'attachedto_key'=>$field
                ],
                $data
            );


        } else {

            // null incoming info - must delete any existing record
            $file = $this->file($field)->first();
            if($file) {
                $file->delete();
            }
            
        }

    }

    public function deleteSingleFile() {
        // $this->users()->sync([]);
    }


    /**
     * 
     * Will be called once per multifile field with the data for it.
     * @param mixed $data
     * 
     * @return [type]
     */
    public function saveMultiFiles($field, $data) {

        dd($data);

        /** Sync the file models: */
        /** NB - this should use the $field as a key so we're only dealing with a specific subset of the file records. */

        // get the ids of the existing rows:
        $stored = $this->files($field)->get()->pluck('id')->toArray();

        // store / update the incoming data
        $incoming = array();

        if(isset($data)) {
            foreach($data as $idx=>$row) {

                $row['attachedto_key'] = $field;
                $row['attachedto_sort'] = $idx;

                $img = $this->files()->updateOrCreate(
                    [
                        'id'=>$row['id'] ?? null,
                    ],
                    $row
                );

                // log the updated / saved IDs
                $incoming[] = $img->id;
            } 
        }
       

        // // do an array_diff to find the IDs to delete (i.e. they weren't in the incoming data)
        $del = array_diff($stored, $incoming);

        if (count($del) > 0) {
            // remove the deleted rows
                File::destroy($del);
        }

        // dd($data);
        // $this->users()->sync($data);
 
    }


    public function deleteMultiFiles() {
        // $this->users()->sync([]);
    }


    public function files($key=null) {
        $q = $this->morphMany(File::class, 'attachedto')->orderby('attachedto_sort');
        if($key) {
            $q->where('attachedto_key', $key);
        }
        return $q;
    }

    public function file($key=null) {
        $q = $this->morphOne(File::class, 'attachedto')->orderby('attachedto_sort');
        if($key) {
            $q->where('attachedto_key', $key);
        }
        return $q;
    }


}