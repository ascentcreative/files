<?php
namespace AscentCreative\Files\Fields;

use AscentCreative\Forms\Contracts\FormComponent;
use AscentCreative\Forms\FormObjectBase;
use AscentCreative\Forms\Traits\CanBeValidated;
use AscentCreative\Forms\Traits\CanHaveValue;


class FileUpload extends FormObjectBase implements FormComponent {

    use CanBeValidated, CanHaveValue;

    public $component = 'files-fields-fileupload';

    public function __construct($name, $label=null) {
        $this->name = $name;
        $this->label = $label;
    }
    

}