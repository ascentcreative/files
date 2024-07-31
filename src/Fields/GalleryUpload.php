<?php
namespace AscentCreative\Files\Fields;

use AscentCreative\Forms\Contracts\FormComponent;
use AscentCreative\Forms\FormObjectBase;
use AscentCreative\Forms\Traits\CanBeValidated;
use AscentCreative\Forms\Traits\CanHaveValue;


class GalleryUpload extends FormObjectBase implements FormComponent {

    use CanBeValidated, CanHaveValue;

    public $component = 'files-fields-galleryupload';

    public function __construct($name, $label=null) {
        $this->name = $name;
        $this->label = $label;

        $this->valueFunction(function($data) use ($name) {
        //     if(is_array($data)) {
        //         return $data[$name] ?? [];
        //     } else {
        //         return $data->images($name)->get();
        //     }

            if($this->model instanceof \Illuminate\Database\Eloquent\Model) {
            
                // If it's a model, it uses an eloquent relation, with a key, so we need to manually set the value
        
                return $this->model->images($name)->get();
        
            } else {

                // otherwise, do this - which is basically just the default operation
                // (but the valueFunction can't yet be added dynamically - one TODO...)
                $prop = dotname($name);
                return $this->traverseData($this->model, $prop);

            }
        });

        

    }

    // public function valueFunction($data) {
    //    
    // }
    

}