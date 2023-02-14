<?php

namespace AscentCreative\Files\Commands;

use Illuminate\Console\Command;

use Illuminate\Support\Facades\Storage;
use AscentCreative\Files\Models\File;


class Purge extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'files:purge';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Purges files not linked to a File model (i.e. an abandoned upload)';

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

        if(!$this->confirm("Delete Files without Database records? This action cannot be undone.")) {
            return 0;
        }

        $stored = Storage::disk('files')->files('');

        $registered = File::all()->pluck('hashed_filename');

        $delete = collect($stored)->diff($registered);

        Storage::disk('files')->delete($delete->toArray());

        return 0;
        
    }
}
