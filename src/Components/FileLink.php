<?php

namespace AscentCreative\Files\Components;

use Illuminate\Support\Facades\Storage;
use Illuminate\View\Component;

class FileLink extends Component
{

   public $file;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($file)
    {
        
        $this->file = $file;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.file-link');
    }
}

