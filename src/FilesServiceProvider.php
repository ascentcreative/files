<?php

namespace AscentCreative\Files;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Routing\Router;

class FilesServiceProvider extends ServiceProvider
{
  public function register()
  {
    //
   
    $this->mergeConfigFrom(
        __DIR__.'/../config/files.php', 'files'
    );


    $this->commands([

    ]);

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


    $this->bootComponents();


    $this->bootPublishes();
    
  }

  

  // register the components
  public function bootComponents() {


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