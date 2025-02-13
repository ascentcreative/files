<?php

use AscentCreative\Files\Models\File;

use AscentCreative\Files\Models\Image as Image;
// use AscentCreative\Images\Models\OutputSpec;

use Illuminate\Http\File as HttpFile;

use AscentCreative\Files\ImageSizer;


Route::middleware(['web'])->group(function() {


    $bannedPattern = '/(\.|\/)(bat|exe|cmd|sh|sql|php([0-9])?|pl|cgi|386|dll|com|torrent|js|app|jar|pif|vb|vbscript|wsf|asp|cer|csr|jsp|drv|sys|ade|adp|bas|chm|cpl|crt|csh|fxp|hlp|hta|inf|ins|isp|jse|htaccess|htpasswd|ksh|lnk|mdb|mde|mdt|mdw|msc|msi|msp|mst|ops|pcd|prg|reg|scr|sct|shb|shs|url|vbe|vbs|wsc|wsf|wsh|tar|gz)/';

    $aryMW = ['files-upload-access']; 
    // ['auth', 'can:upload-files'] are now combined into the above Middleware;

    // TODO - Read encrypted config data to avoid client-side bypassing of allowed max size etc.
    Route::post('/chunked-upload', function() use ($bannedPattern) {

        if(request()->disk == 'public') {
            abort(401, 'Illegal Disk');
        }
        $disk = Storage::disk(request()->disk);

        // open or create a temp file to store the incoming chunks
        $path = request()->path;
        if ($path != '') {
            $path .= '/';
        }
        $chunkfile = $path . request()->chunkerId . '.' . pathinfo($_FILES['payload']['name'], PATHINFO_EXTENSION);
        $chunkpath = $disk->path($chunkfile);
        $out = fopen($chunkpath, request()->chunkIdx == 1 ? "wb" : "ab");


        // append the chunk to the file:
        if ($out) {

            $in = fopen($_FILES['payload']['tmp_name'], "rb");

            if ($in) {
                while ($buff = fread($in, 4096)) { 
                    fwrite($out, $buff); 
                }
            } else {
                return response()->json(["ok"=>0, "info"=>'Failed to open input stream']);
            }

            fclose($in);
            fclose($out);
            $in = null;
            $out = null;
            unlink($_FILES['payload']['tmp_name']);
        }

        // if final chunk - move the completed file to storage
        if(request()->chunkIdx == request()->chunkCount) {
            
            $payload = request()->file('payload');

            preg_match($bannedPattern,
                        $payload->getClientOriginalName(),
                        $matches);

            if(count($matches) > 0) {
                abort(401, 'Banned Filetype');
            }
    

            // dump(request()->all());
            // dd($payload);
            $sanitise = $payload->getClientOriginalName();
            $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);

            // // Store image on disk.
            $dest = $path;
            if(request()->preserveFilename) {
                $dest .= $sanitise;
            } else {
                $tempfile = new HttpFile($chunkpath);
                $dest .= $tempfile->hashName();
            }

            $disk->move($chunkfile, $dest);

             // Create a File model, but don't save it - Return as JSON.
            $file = new File();
            $file->disk = request()->disk; //'files';
            $file->hashed_filename = $dest; //$path; //pathinfo($path)['basename']; 

            $file->original_filename = $sanitise; 
            $file->size = $disk->size($dest);
            $file->mime_type = $disk->mimeType($dest);

            return response()->json($file);

        }

        // not final chunk, return the request info so 
        // the JS knows to send the next chunk.
        return response()->json(request()->all());

    })->middleware($aryMW); 

    // Route::get('diskcheck', function() {
    //     $disk = Storage::disk('public');
    //     dd($disk);
    // });


    // Old endpoint - used for single shot uploads.
    // Better to use the chunked option above
    // *** disbaled for secuirty ***
    // Route::post('/file-upload', function() use ($bannedPattern) {

    //     // dd("here");
        
    //     $params = request()->all();
    //     $disk = Storage::disk($params['disk']);
      
    //     if(request()->disk == 'public') {
    //         abort(401);
    //     }

    //     $disk = Storage::disk($params['disk']);
    //     // dd($params);

    //     $payload = request()->file('payload');

    //     // check file types
    //     // (Should make this list configrable)
    //     preg_match($bannedPattern,
    //                 $payload->getClientOriginalName(),
    //                 $matches);

    //     if(count($matches) > 0) {
    //         abort(401, 'Banned Filetype');
    //     }

    //     $sanitise = $payload->getClientOriginalName();
    //     $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);
      
    //     // Store image on disk.
    //     if($params['preserveFilename']) {
    //         $path = $disk->putFileAs('/' . $params['path'], request()->file('payload'),  $sanitise);
    //     } else {
    //         $path = $disk->putFile('/' . $params['path'], request()->file('payload'));
    //     }
        
  
    //     // Create a File model, but don't save it - Return as JSON.
    //     $file = new File();
    //     $file->disk = $params['disk']; //'files';
    //     $file->hashed_filename = $path; //pathinfo($path)['basename']; 

       
    //     $file->original_filename = $sanitise; 
    //     $file->size = $disk->size($path);
    //     $file->mime_type = $disk->mimeType($path);

    //     // TODO - the File model will need to check for duplicate filenames and increment on save.
    //     // Or does it need to? yes, I think it does. 

    //     return response()->json($file);

    // });
    //->middleware($aryMW);


    /**
     * Route to access the file.
     * NB - the FilePolicy will control access, and will look for the policy for the model the file is attached to.
     */
    Route::get('/getfile/{file:hashed_filename}', function(File $file) {

        return $file->download();

    })
    ->can('download', 'file')
    ->name('file.url');


    /**
     * Route for streaming / ranged bytes:
     * NB - the FilePolicy will control access, and will look for the policy for the model the file is attached to.
     */
    Route::get('/streamfile/{file:hashed_filename}', function (File $file) {

        return $file->stream();
    
    })
    ->can('download', 'file')
    ->name('file.stream');

   

    // Route::get('/files/serverbrowser/{disk}', [\AscentCreative\Files\Controllers\ServerController::class, 'browse'])->name('files.server')->middleware('auth', 'can:browse-files');






    /**
     * Route to stream the image according to a spec definition
     *  - loads the spec from the images-output config file
     *  - Creates rendered images on the fly, but only if not already created
     *  - Allows browser to cache images as it would with files served directly
     */
    // Route::get('/image/{spec}/{image:hashed_filename}', function($spec, Image $image) { //$filename) {
    Route::get('/image/{spec}/{filename}/{idx?}', function($spec, $filename, $idx=0) {


        // dd('exit');
        // get the image by the filename requested
        // - filename could be the hashed or original. 
        // - if hashed, just stream that file.

    
        // Note: the Image model may not exist yet
        // The file may have been uploaded, but not comitted to the database
        // As such, for previews etc we can allow access using the hashed filename,
        // bypassing the model (which is essentially just a lookup to get the hashed filename anyway)
        
        $model = Image::where('hashed_filename', $filename)->first();
        if(!$model) {
            // emergency check by original filename
            Image::where('original_filename', $filename)->first();
        }
        if($model) {
            $filename = $model->hashed_filename; // get the hashed filename from the model
        }
        
        if(!$model) {

            // What if the requested file is not an image??
            // - i.e. we're using this as a conversion for PDFs (etc)
            $fileModel = File::where('hashed_filename', $filename)->first();
            if($fileModel) {

                Gate::authorize('download', $fileModel);

                $converter = config('files.converters.' . $fileModel->mime_type . '.image/jpg');
                if($converter) {
                    $filename = $converter::convert($fileModel->hashed_filename, []);
                } else {
                    dd("Conversion for " . $fileModel->mime_type . " to image has not been implemented yet");
                }

            }
        } else {
            Gate::authorize('download', $model);
        }

        // dump($idx);
        // dd($filename);

        if(is_array($filename)) {
            $filename = $filename[$idx];
        }

        // does this file exist for the requested spec?
        if (!Storage::disk('files')->exists($spec . '/'. $filename[0])) {

            // No:
            // - so does it exist in the 'original' folder?
            if (Storage::disk('files')->exists($filename)) {

                ImageSizer::handle($filename, $spec);

            } else {
                // nope, not in originals folder either - bail.
                abort(404);
            }
        }

        /* set up caching for one week */
        $cache_exp = new Carbon\Carbon();
        $cache_exp->addWeeks(1);

        return Storage::disk('files')->download($spec . '/'. $filename, null, [
            'Cache-Control' => 'public, max-age=' . (86400 * 7),
            'expires' => $cache_exp->toRfc7231String(),
        ]);

    })->name('image.display'); 


});
