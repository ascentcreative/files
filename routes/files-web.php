<?php

use AscentCreative\Files\Models\File;


Route::middleware(['web'])->group(function() {
    
    Route::post('/file-upload', function($spec=null) {

        $params = request()->all();

        $disk = Storage::disk($params['disk']);
        // dd($params);
      
        // Store image on disk.
        $path = $disk->putFile('/' . $params['path'], request()->file('payload'));
  
        // Create a File model, but don't save it - Return as JSON.
        $file = new File();
        $file->disk = $params['disk']; //'files';
        $file->hashed_filename = $path; //pathinfo($path)['basename']; 

        $payload = request()->file('payload');
        $sanitise = $payload->getClientOriginalName();
        $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);
        $file->original_filename = $sanitise; 
        $file->size = $disk->size($path);
        $file->mime_type = $disk->mimeType($path);

        // TODO - the File model will need to check for duplicate filenames and increment on save.
        // Or does it need to? yes, I think it does. 

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
