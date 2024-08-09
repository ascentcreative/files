<?php

namespace AscentCreative\Files\Components;

use Illuminate\Support\Facades\Storage;
use Illuminate\View\Component;

class FileLinks extends Component
{

   public $files;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($files)
    {
        
        $this->files = $files;


    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.file-links');
    }
}

