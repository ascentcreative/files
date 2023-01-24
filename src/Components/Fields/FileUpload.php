<?php

namespace AscentCreative\Files\Components\Fields;

use Illuminate\View\Component;

class FileUpload extends Component
{

    
    public $label;
    public $name;
    public $value;

    public $disk;
    public $path;
    public $preserveFilename;
    public $wrapper;
    public $class;

    public $accept;

    public $multiple;
    public $sortable;


    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($label, $name, $value, $disk='public', $path='ajaxuploads', $preserveFilename=false, $wrapper="bootstrapformgroup", $class='', $accept=[], $multiple=false, $sortable=false)
    {
        
        $this->label = $label;
        $this->name = $name;
        $this->value = $value;
        $this->accept = $accept;

        $this->preserveFilename = $preserveFilename;
        $this->disk = $disk;
        $this->path = $path; 
        $this->wrapper = $wrapper;
        $this->class = $class;

        $this->multiple = $multiple;
        $this->sortable = $sortable;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.fields.fileupload.' . ($this->multiple ? 'multiple' : 'single') );
    }
}
