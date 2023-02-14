<?php
namespace AscentCreative\Files;

use AscentCreative\Files\Models\Image as Image;

use Intervention\Image\Image as InterventionImage;
use Intervention\Image\ImageManager;

use Illuminate\Support\Facades\Storage;

/**
 * resizes an image according to a spec and writes the file to storage
 */
class ImageSizer {

    static function handle($filename, $spec) {

        if (Storage::disk('images')->exists($filename)) {
        
        // Yes - create a copy according to the spec
            $manager = new ImageManager(); 

            $path = Storage::disk('images')->path($filename);
            $iImage = $manager->make($path);

            // apply the spec...

            // load the spec definition
            $options = config('images-output.' . $spec);

            if(is_null($options)) {
                throw new \Exception('Image Spec "' . $spec . '" not found.');
            }
            
            switch($options['method']) {
                case 'preserve_aspect':
                    $iImage->resize($options['width'], $options['height'], function($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                        });
                    break;

                case 'crop':
                    $iImage->fit($options['width'], $options['height']);
                    break;
            }

            // ensure the spec folder exists:
            Storage::disk('images')->makeDirectory($spec);
            
            // save to disk in the spec folder:
            $iImage->save(Storage::disk('images')->path($spec . '/'. $filename));

        } else {

        }

    }

}