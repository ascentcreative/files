<?php

use AscentCreative\Files\Models\File;


Route::middleware(['web'])->group(function() {
    
    Route::post('/file-upload', function($spec=null) {

        // return $spec ?? "No Spec Sent";

        $params = request()->all();
      
        // Store image on disk.
        $path = Storage::disk('files')->putFile('', request()->file('payload'));
  
        // Create a File model, but don't save it - Return as JSON.
        $file = new File();
        $file->disk = 'files';
        $file->hashed_filename = pathinfo($path)['basename']; // only store the hashed name in the model. Don't need any folders etc.

        $payload = request()->file('payload');
        $sanitise = $payload->getClientOriginalName();
        $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);
        $file->original_filename = $sanitise; // nb - the File model will check for duplicate filenames and increment on save.

        // or should there be a 'commit' flag in the posted data for times when we do need to do that?
        // - If we do, we should allow the imageable_xyz to be supplied also.

        return response()->json($file);

    })->middleware('auth', 'can:upload-files');


    /**
     * Route to access the file.
     */
    Route::get('/getfile/{file:original_filename}', function(File $file) {

        return $file->download();

    })
    // NB - the FilePolicy will control access, and will look for the policy for the model the file is attached to.
    ->can('download', 'file')
    ->name('file.url');

   

    Route::get('/image/test', function() {
        return view('images::test');
    });

});
