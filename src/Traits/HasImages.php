<?php

namespace AscentCreative\Files\Traits;

use AscentCreative\CMS\Traits\Extender;
use AscentCreative\Files\Models\Image;

use Illuminate\Http\Request;

/**
 * [Description HasImages]
 * Allows fields to be specified as being single images which will be captured and processed by this trait.
 */
trait HasImages {

    use Extender;

    public function initializeHasImages() {

        if(is_array($this->image_fields)) {
            foreach($this->image_fields as $image) {
               $this->addCapturable($image, 'deleteImage', 'saveImage');
            }
        }

    }


    /**
     * 
     * Will be called once per gallery field with the data for it.
     * @param mixed $data
     * 
     * @return [type]
     */
    public function saveImage($field, $data) {

        if($data) {

            $stored = $this->image($field)->first();

            if ($stored && $stored->id != ($data['id'] ?? '')) {
                $stored->delete();
                // dd('dleeted')
            } 
        
            $file = $this->image($field)->updateOrCreate(
                [
                    'id'=>$data['id'] ??  null,
                    'attachedto_key'=>$field
                ],
                $data
            );


        } else {

            // null incoming info - must delete any existing record
            $file = $this->image($field)->first();
            if($file) {
                $file->delete();
            }
            
        }

        // // dd('saving');

        // /** Sync the image models: */
        // /** NB - this should use the $field as a key so we're only dealing with a specific subset of the image records. */

        // // get the ids of the existing rows:
        // $stored = $this->image($field)->get()->collect()->transform(function($item) { return $item->id; })->toArray();

        // // // store / update the incoming data
        // $incoming = array();

        // if(isset($data)) {
        //     // foreach($data as $idx=>$row) {

        //         $data['imageable_key'] = $field;
        //         $data['imageable_sort'] = 0;

    
        //         $img = $this->files()->updateOrCreate(
        //             [
        //                 'id'=>$data['id'],
        //             ],
        //             $data
        //         );

        //         // log the updated / saved IDs
        //         $incoming[] = $img->id;
        //     // } 
        // }

       

        // // // do an array_diff to find the IDs to delete (i.e. they weren't in the incoming data)
        // $del = array_diff($stored, $incoming);

        // if (count($del) > 0) {
        //     // remove the deleted rows
        //         Image::destroy($del);
        // }

        // dd($data);
        // $this->images()->sync($data);
 
    }


    public function deleteImage() {
        // $this->users()->sync([]);
    }


    public function image($key) {
        // dump("IMAGES:: " . $key);
        $q = $this->morphOne(Image::class, 'attachedto')->where('attachedto_key', $key);
        return $q;
    }


}