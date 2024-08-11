<?php

namespace AscentCreative\Files\Components;

use Illuminate\Support\Facades\Storage;
use Illuminate\View\Component;

class LightboxGallery extends Component
{

   public $images;
   public $options;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($images, $options=[])
    {
        
        $this->options = $options;
        $this->images = $images;

    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.lightbox-gallery');
    }
}

