<?php

namespace AscentCreative\Files\Commands;

use Illuminate\Console\Command;

use Illuminate\Support\Facades\Storage;
use AscentCreative\Files\Models\File;


class PopulateAttributes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:setattribs {--overwrite : If set, all existing values will be checked}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sets the Mimetype and Filesizes';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     * 
     * TODO: ability (requirement??) to specify disk and path
     *
     * @return int
     */
    public function handle()
    {

        if($this->option('overwrite')) {
            $files = File::all();
        } else {
            $files = File::where('mime_type', '')->orWhere('size', 0)->get();
        }

        foreach($files as $file) {

            $disk = Storage::disk($file->disk);
            $file->size = $disk->size($file->hashed_filename);
            $file->mime_type = $disk->mimeType($file->hashed_filename);
            $file->save();

        }
       
        return 0;
        
    }
}
