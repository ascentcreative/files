<?php

namespace AscentCreative\Files\Traits;

use AscentCreative\CMS\Traits\Extender;
use AscentCreative\Files\Models\Image;

use Illuminate\Http\Request;

/**
 * [Description HasGalleries]
 * Allows fields to be specified as being galleries (gallery upload fields) which will be captured and processed by this trait.
 */
trait HasGalleries {

    use Extender;

    public function initializeHasGalleries() {

        if(is_array($this->gallery_fields)) {
            foreach($this->gallery_fields as $gallery) {
               $this->addCapturable($gallery, 'deleteGalleries', 'saveGallery');
            }
        }

        // dump(request()->all());
        // dd($this);w
        // $this->addCapturable('users');
    }


    /**
     * 
     * Will be called once per gallery field with the data for it.
     * @param mixed $data
     * 
     * @return [type]
     */
    public function saveGallery($field, $data) {

        /** Sync the image models: */
        /** NB - this should use the $field as a key so we're only dealing with a specific subset of the image records. */

        // get the ids of the existing rows:
        $stored = $this->images($field)->get()->pluck('id')->toArray(); 

        // store / update the incoming data
        $incoming = array();

        if(isset($data)) {
            foreach($data as $idx=>$row) {

                $row['attachedto_key'] = $field;
                $row['attachedto_sort'] = $idx;

    
                $img = $this->images()->updateOrCreate(
                    [
                        'id'=>$row['id'] ?? null,
                    ],
                    $row
                );

                // log the updated / saved IDs
                $incoming[] = $img->id;
            } 
        }

       

        // do an array_diff to find the IDs to delete (i.e. they weren't in the incoming data)
        $del = array_diff($stored, $incoming);

        if (count($del) > 0) {
            // remove the deleted rows
                Image::destroy($del);
        }

        // dd($data);
        // $this->users()->sync($data);
 
    }

    // DEFINED ON THE MODEL CURRENTLY
    // public function users() {
    //     return $this->hasMany(Lyric::class)->orderBy('sort');
    // }

    public function deleteGalleries() {
        // $this->users()->sync([]);
    }


    public function images($key=null) {
        // dump("IMAGES:: " . $key);
        $q = $this->morphMany(Image::class, 'attachedto')->orderby('attachedto_sort');
        if($key) {
            $q->where('attachedto_key', $key);
        }
        return $q;
    }


}