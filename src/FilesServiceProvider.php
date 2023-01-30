<?php

namespace AscentCreative\Files;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Router;

use AscentCreative\Files\Models\File;
use AscentCreative\Files\Policies\FilePolicy;

class FilesServiceProvider extends ServiceProvider
{
  public function register()
  {
    //
   
    $this->mergeConfigFrom(
        __DIR__.'/../config/files.php', 'files'
    );


    $this->commands([
        \AscentCreative\Files\Commands\Purge::class,
        
    ]);

    Gate::policy(File::class, FilePolicy::class);

  }

  public function boot()
  {

    // create a non-public disk for storing uploaded images
    config(['filesystems.disks.files' => [
        'driver' => 'local',
        'root' => storage_path('files'),
    ]]);

    $this->loadViewsFrom(__DIR__.'/../resources/views', 'files');

    $this->loadRoutesFrom(__DIR__.'/../routes/files-web.php');

    $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

    packageAssets()->addScript('/vendor/ascent/files/md5.js');
    packageAssets()->addScript('/vendor/ascent/files/ChunkableUploader.js');

    packageAssets()->addStylesheet('/vendor/ascent/files/ascent-fileupload.css');
    packageAssets()->addScript('/vendor/ascent/files/ascent-fileupload.js');

    packageAssets()->addStylesheet('/vendor/ascent/files/ascent-fileuploadmulti.css');
    packageAssets()->addScript('/vendor/ascent/files/ascent-fileuploadmulti.js');

    $this->bootComponents();

    $this->bootPublishes();
    
  }

  

  // register the components
  public function bootComponents() {

        Blade::component('files-fields-fileupload', 'AscentCreative\Files\Components\Fields\FileUpload');
    

  }




  

    public function bootPublishes() {

      $this->publishes([
        __DIR__.'/../assets' => public_path('vendor/ascent/files'),
    
      ], 'public');

      $this->publishes([
        __DIR__.'/../config/images.php' => config_path('files.php'),
      ]);


    }



}