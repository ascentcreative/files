<?php

namespace AscentCreative\Files\Commands;

use Illuminate\Console\Command;

use Illuminate\Support\Facades\Storage;
use AscentCreative\Files\Models\Image;
use AscentCreative\Files\ImageSizer;



class RefreshImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:refresh {spec?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Refresh/Rebuild images';

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
     * @return int
     */
    public function handle()
    {

        // dd('Not Yet Implemented');
        // $path = Storage::disk('images')->path('original');
        // dd($path);

        $imgs = Image::all();


        if(!is_null($this->argument('spec'))) {
            $specs = [$this->argument('spec')];
        } else {
            if(!$this->confirm("Refreshing ALL specs - do you wish to continue?")) {
                return 0;
            }
            $specs = array_keys(config('images-output'));
        }
       

        // $spec = 'product_thumb';

        // foreach(glob($path . '/*') as $file) {
        foreach($imgs as $img) {
            if($img->original_filename) {
                foreach($specs as $spec) {
                    echo "\nProcessing: " . $img->original_filename . ' (' . $img->hashed_filename . ", spec=" . $spec . ")";
                    try {
                        ImageSizer::handle($img->hashed_filename, $spec, true);
                    } catch (\Exception $e) {
                        $this->error("\nERROR: " . $e->getMessage());
                        return 0;
                    }
                    
                }
            }
        }


        $this->newline();
        return 0;
    }
}
