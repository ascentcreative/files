<?php

namespace AscentCreative\Files\Components;

use Imagick;
use ImagickPixel;


use Illuminate\Support\Facades\Storage;
use Illuminate\View\Component;

class Previewer extends Component
{

   public $file;
   public $pageCount = 0;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($file)
    {
        
        $this->file = $file;

        $disk = Storage::disk('files');

        try {
            $ping = new Imagick();
            $ping->pingImage($disk->path($file->hashed_filename));
            $this->pageCount = $ping->getNumberImages();
        } catch (\ImagickException $ie) {
            // echo $ie->getMessage();
            $this->pageCount = -99;
        }


    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|string
     */
    public function render()
    {
        return view('files::components.previewer');
    }
}

