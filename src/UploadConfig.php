<?php

namespace AscentCreative\Files;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/** stores details about an uploader's destination and config so we're not relying on data from the client */
class UploadConfig {

    private $token = '';

    private $data = [
        'disk' => 'files',
        'path' => '',
        'preserveFilename' => false,
        'allowedSize' => null
    ];

    private $chunkerWhitelist = [];

    private $accept = [

    ];
 
    private $allowedTypes = [];

    private $bannedTypes = [
        'bat','exe','cmd','sh','sql','php','pl',
        'php0', 'php1', 'php2', 'php3', 'php4', 'php5', 'php6', 'php7', 'php8', 'php9',
        'cgi','386','dll','com','torrent','js','app','jar','pif','vb','vbscript','wsf','asp','cer',
        'csr','jsp','drv','sys','ade','adp','bas','chm','cpl','crt','csh','fxp','hlp','hta','inf','ins',
        'isp','jse','htaccess','htpasswd','ksh','lnk','mdb','mde','mdt','mdw','msc','msi','msp','mst','ops','pcd','prg',
        'reg','scr','sct','shb','shs','url','vbe','vbs','wsc','wsf','wsh','tar', 'gz'
    ];


    public function __construct() {
        $this->token = Str::uuid();
    }



    static function make(Array $config) {

        $cfg = new UploadConfig();

        foreach($config as $key=>$value) {
         
            if($key == 'accept') {
                $cfg->accept($value);
            } else {
                $cfg->$key = $value;
            }
        }
        session()->put("upload_configs." . $cfg->token, $cfg);

        return $cfg;

    }




    public function __get($key) {
        if(property_exists($this, $key)) {
            return $this->$key;
        }
        return $this->data[$key] ?? null;
    }


    public function __set($key, $value) {

        if(method_exists($this, $key)) {
            $this->$key($value);
        } else {
            $this->data[$key] = $value;
        }
    }

    public function set($key, $value) {
        $this->$key = $value;
        return $this;
    }

    public function get($key) {
        return $this->$key;
    }


    public function addAllowedType($type) {
        $this->allowedTypes[] = $type;
    }

    public function addAllowedTypes(Array $types) {
        foreach($types as $type) {
            $this->addAllowedType($type);
        }
        return $this;
    }


    // wholesale replace of accept array
    public function accept($accept) {

        if(is_string($accept)) {
            $this->accept = [$accept];
        }

        if(is_array($accept)) {
            $this->accept = $accept;
        }

    }


    public function addMimeType($type) {
        $this->accept[] = $type;
    }

    public function addMimeTypes(Array $types) {
        foreach($types as $type) {
            $this->addMimeType($type);
        }
        return $this;
    }    

    public function whitelistChunker($chunkerId) {
        $this->chunkerWhitelist[] = $chunkerId;
    }

    public function allowFile(UploadedFile $file) {

        // Chunked uploads should only be validated on the first chunk:
        if($file->chunkerId) {
            if(array_search($file->chunkerId, $this->chunkerWhitelist) !== false) {
                return true;
            }
        }

        // validate mime type...
        if(count($this->accept) > 0) {

            $v = Validator::make(
                    [
                        'file' => $file,
                    ],
                    [
                        'file' => 'required|mimetypes:' . join(',', $this->accept),
                    ]
                );
        
            if(!$v->fails()) {
                $this->whitelistChunker($file->chunkerId);
            }
            return !$v->fails();

        } else {

            // use an inverted validator - if it passes, we have banned file extension:
            // i.e. we WANT this to fail"
            $v = Validator::make(
                [
                    'file' => $file,
                ],
                [
                    'file' => 'extensions:' . join(',', $this->bannedTypes),
                ]
            );

            // dd(join(',', $this->bannedTypes));
            if($v->fails()) {
                $this->whitelistChunker($file->chunkerId);
            }
            return $v->fails();

        }

    }




    public function allowExtension($filename) {

        if(count($this->allowedTypes) > 0) {

            // only allow whitelisted types
            $str = join('|', $this->allowedTypes);
            $allowedPattern = '/(\.|\/)(' . $str . ')/i';

            preg_match($allowedPattern,
                            $filename,
                            $matches);

            return count($matches) > 0;

        } else {

            // don't allow blacklisted types
            $str = join('|', $this->bannedTypes);
            $bannedPattern = '/(\.|\/)(' . $str . ')/i';

            preg_match($bannedPattern,
                        $filename,
                        $matches);
    
             return count($matches) == 0;

        }
       

    }

}