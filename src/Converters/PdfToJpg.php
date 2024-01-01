<?php
namespace AscentCreative\Files\Converters;

use Illuminate\Support\Facades\Storage;

use AscentCreative\Files\Converters\AbstractConverter;

use Imagick;
use ImagickPixel;

class PdfToJpg extends AbstractConverter {

   /**
    * Perform the filetype conversion 
    *    
    * @param mixed $filename the input file
    * 
    * @return mixed String or Array of Strings of the resulting image file path(s)
    */
    public function handle($filename, $opts=[], $force = false) : mixed {

        // returned file should use the same root filename as the original
        // on the assumption that incoming filename will be hashed, so collisions are not a concern
        $disk = Storage::disk('files');

        $pathinfo = (pathinfo($disk->path($filename)));
        $output = 'transforms/PdfToJpg/';

        $disk->makeDirectory($output);

        // IMPORTANT TODO: need to only create images if they don't exist (or if force is set to true).
        // MAYBE... Parent class handles that detection, and we only need to create a class to perform the actual
        // conversion logic, returning a list of the generated files. Parent class should be able to detect the files
        // to return.
       
        $ping = new Imagick();
        $ping->pingImage($disk->path($filename));
        $pagecount = $ping->getNumberImages();

        $files = [];

        for($page = 0; $page < $pagecount; $page++) {

            $im = new Imagick();

            $outfile = $output . $pathinfo['filename'] . '-' . $page . '.jpg';

            $im->setResolution(300,300);
            $im->readimage($disk->path($filename) . '[' . $page . ']'); 
            $im->setImageFormat('jpeg');    
            $im->setImageBackgroundColor('#ffffff');
            $im = $im->flattenImages();
            
            $im->writeImage($disk->path($outfile)); 
            $im->clear(); 
            $im->destroy();
            
            $files[] = $outfile;

        }

        // dd($pagecount);

        return $files; //$output . $pathinfo['filename'] . '.jpg';

    }

}