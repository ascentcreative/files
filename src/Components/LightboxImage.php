<?php

namespace AscentCreative\Files\Components;

use Illuminate\Support\Facades\Storage;
use Illuminate\View\Component;

class LightboxImage extends Component
{

   public $image;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($image)
    {
        
        $this->image = $image;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.lightbox-image');
    }
}

