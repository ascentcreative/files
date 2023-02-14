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

    public $chunkSize; // the max size of a file chunk, governed by the server
    public $allowedSize; // the upper limit of files we'll allow!

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($label, $name, $value=null, $disk='files', $path='', $preserveFilename=false, $wrapper="bootstrapformgroup", $class='', $accept=[], $multiple=false, $sortable=false, $allowedSize='', $chunkSize='')
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

        if ($allowedSize != '') {
            if(is_string($allowedSize)) {
                $this->allowedSize = $this->parseBytes($allowedSize);
            } else if (is_numeric($allowedSize)) {
                $this->allowedSize = $allowedSize;
            }
        } else {
            // TODO - use a value from a config file
            // Or, maybe we encode/encrypt a copy of the config, and the server cross checks that.... <- Yes. Do this.
        }

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
