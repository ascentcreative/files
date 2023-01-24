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


  

    // /**
    //  * Route to stream the image according to a spec definition
    //  *  - loads the spec from the images-output config file
    //  *  - Creates rendered images on the fly, but only if not already created
    //  *  - Allows browser to cache images as it would with files served directly
    //  */
    // Route::get('/image/{spec}/{filename}', function($spec, $filename) {

    //     // get the image by the filename requested
    //     // - filename could be the hashed or original. 
    //     // - if hashed, just stream that file.

    
    //     // Note: the Image model may not exist yet
    //     // The file may have been uploaded, but not comitted to the database
    //     // As such, for previews etc we can allow access using the hashed filename,
    //     // bypassing the model (which is essentially just a lookup to get the hashed filename anyway)
        
    //     $model = Image::where('original_filename', $filename)->first();
    //     if($model) {
    //         $filename = $model->hashed_filename; // get the hashed filename from the model
    //     }


    //     // does this file exist for the requested spec?
    //     if (!Storage::disk('images')->exists($spec . '/'. $filename)) {

    //         // No:
    //         // - so does it exist in the 'original' folder?
    //         if (Storage::disk('images')->exists('/original/'. $filename)) {

    //             ImageSizer::handle($filename, $spec);

    //         } else {
    //             // nope, not in originals folder either - bail.
    //             abort(404);
    //         }
    //     }

    //     /* set up caching for one week */
    //     $cache_exp = new Carbon\Carbon();
    //     $cache_exp->addWeeks(1);

    //     return Storage::disk('images')->download($spec . '/'. $filename, null, [
    //         'Cache-Control' => 'public, max-age=' . (86400 * 7),
    //         'expires' => $cache_exp->toRfc7231String(),
    //     ]);

    // })->name('image.display'); 


    Route::get('/image/test', function() {
        return view('images::test');
    });

});
