<?php
namespace AscentCreative\Files\Converters;

use Illuminate\Support\Facades\Storage;

abstract class AbstractConverter {

    static function convert($filename, $opts=[], $force=false) : mixed {

        $class = explode('\\', get_called_class());
        $folder = 'transforms/' . array_pop($class);
        // dd($xyz);

        $pathinfo = pathinfo($filename);
        $disk = Storage::disk('files');
        $path = $disk->path($folder);

        $files = glob($path . '/' . $pathinfo['filename'] . '*.*');
        
        for($i = 0; $i < count($files); $i++) {
            $p = pathinfo($files[$i]);
            $files[$i] = $folder . '/' . $p['basename'];
        }

        if($force || count($files) == 0) {
            $converter = new static();
            $files = $converter->handle($filename, $opts);
        }
        
        // dd($files);
        return $files; //[0];

    }

    abstract public function handle($filename, $opts=[]) : mixed;

}