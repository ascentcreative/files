<?php

namespace AscentCreative\Files\Components\Fields;

use Illuminate\View\Component;

class GalleryUpload extends Component
{

    
    public $label;
    public $name;
    public $value;

    public $spec;

    public $disk;
    public $path;
    public $preserveFilename;
    public $wrapper;
    public $class;

    public $accept;

    public $sortable;

    public $maxFiles;


    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($label, $name, $value, $spec=null, $disk='images', $path='', 
                                    $maxFiles = 0,
                                    $preserveFilename=false, $wrapper="bootstrapformgroup", $class='', $accept=[], $sortable=true)
    {
        
        $this->label = $label;
        $this->name = $name;
        $this->value = $value;
        $this->accept = $accept;

        $this->spec = $spec;

        $this->preserveFilename = $preserveFilename;
        $this->disk = $disk;
        $this->path = $path; 
        $this->wrapper = $wrapper;
        $this->class = $class;

        $this->sortable = $sortable;
        $this->maxFiles = $maxFiles;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.fields.galleryupload');
    }
}
