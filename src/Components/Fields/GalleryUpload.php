<?php

namespace AscentCreative\Files\Components\Fields;

use Illuminate\View\Component;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;
use AscentCreative\Files\UploadConfig;

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
    public $allowedSize;

    public $chunkSize;
    
    public $token;
    public $config;


    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($label, $name, $value, $spec=null, $disk='files', $path='', 
                                    $maxFiles = 0, $allowedSize="5M", $chunkSize='',
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

        $this->allowedSize = $allowedSize;

        $chunksizes = [floor($this->serverMaxFileSize() * 0.90)];  // 90% of max, just to allow other params in a post.

        // allow user override to anything less than the default from the server
        if($chunkSize != '') {
            if(is_string($chunkSize)) {
                $chunksizes[] = $this->parseBytes($chunkSize);
            } else if (is_numeric($chunkSize)) {
                $chunksizes[] = $chunkSize;
            }
        }
        $this->chunkSize = min($chunksizes);


        // create a token in the session and pass to the UI.
        $key = uniqid();
        $value = Str::uuid()->toString();
    
        session()->push('upload_tokens.' . $key, $value);

        // session()->push('upload_tokens.abc', '123');
        $this->token = Crypt::encryptString($key . ':' . $value);

        $this->config = UploadConfig::make([
            'accept'=>'image/*',
            'disk' => $disk,
            'path' => $path,
            'preserveFilename' => $preserveFilename,
            'allowedSize' => $this->allowedSize
        ]);

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


    private function serverMaxFileSize() {

        return min([$this->parseBytes(ini_get('upload_max_filesize'), ini_get('post_max-size'))]);

    }

    private function parseBytes($val) {

        $val = trim($val);

        if (is_numeric($val))
            return $val;

        $last = strtolower($val[strlen($val)-1]);
        $val  = substr($val, 0, -1); // necessary since PHP 7.1; otherwise optional

        switch($last) {
            // The 'G' modifier is available since PHP 5.1.0
            case 'g':
                $val *= 1024;
            case 'm':
                $val *= 1024;
            case 'k':
                $val *= 1024;
        }

        return $val;
    }

}
