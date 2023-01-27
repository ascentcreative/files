<?php

use AscentCreative\Files\Models\File;

use Illuminate\Http\File as HttpFile;


Route::middleware(['web'])->group(function() {


    Route::post('/chunked-upload', function() {

        $disk = Storage::disk(request()->disk);
        $disk->makeDirectory('.tmp');

        // dd("fweuffwe");

        // open or create a temp file to store the incoming chunks
        $chunkfile = '/.tmp/' . request()->chunkerId . '.' . request()->file('payload')->extension();
        $chunkpath = $disk->path($chunkfile);
        $out = fopen($chunkpath, request()->chunkIdx == 1 ? "wb" : "ab");

        // append the chunk to the file:
        if ($out) {
            $in = fopen($_FILES['payload']['tmp_name'], "rb");

            if ($in) {
                while ($buff = fread($in, 4096)) { fwrite($out, $buff); }
            } else {
                return response()->json(["ok"=>0, "info"=>'Failed to open input stream']);
            }

            fclose($in);
            fclose($out);
            unlink($_FILES['payload']['tmp_name']);
        }

        // if final chunk - move the completed file to storage
        if(request()->chunkIdx == request()->chunkCount) {
            
            $payload = request()->file('payload');

            // dd($payload);
            $sanitise = $payload->getClientOriginalName();
            $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);

            // // Store image on disk.
            $dest = request()->path;
            if ($dest != '') {
                $dest .= '/';
            }
            if(request()->preserveFilename) {
                $dest .= $santise;
            } else {
                $tempfile = new HttpFile($chunkpath);
                $dest .= $tempfile->hashName();
            }
            //     $path = $disk->putFileAs('/' . request()->path, new HttpFile($chunkpath),  $sanitise);
            // } else {
            //     $path = $disk->putFile('/' . request()->path, new HttpFile($chunkpath));
            // }

            // dd($chunkfile);
            // dd($dest);

            $disk->move($chunkfile, $dest);

             // Create a File model, but don't save it - Return as JSON.
            $file = new File();
            $file->disk = request()->disk; //'files';
            $file->hashed_filename = $dest; //$path; //pathinfo($path)['basename']; 

            $file->original_filename = $sanitise; 
            // $file->size = $disk->size($dest);
            // $file->mime_type = $disk->mimeType($dest);

            // unlink($chunkpath); // remove temp file

            return response()->json($file);

        }

        return response()->json(request()->all());

    })->middleware('auth', 'can:upload-files');




    
    Route::post('/file-upload', function() {

        $params = request()->all();

        $disk = Storage::disk($params['disk']);
        // dd($params);

        $payload = request()->file('payload');
        $sanitise = $payload->getClientOriginalName();
        $sanitise = str_replace(array('?', '#', '/', '\\', ','), '', $sanitise);
      
        // Store image on disk.
        if($params['preserveFilename']) {
            $path = $disk->putFileAs('/' . $params['path'], request()->file('payload'),  $sanitise);
        } else {
            $path = $disk->putFile('/' . $params['path'], request()->file('payload'));
        }
        
  
        // Create a File model, but don't save it - Return as JSON.
        $file = new File();
        $file->disk = $params['disk']; //'files';
        $file->hashed_filename = $path; //pathinfo($path)['basename']; 

       
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
