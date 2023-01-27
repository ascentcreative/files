@extends('forms::components.wrappers.' . $wrapper)

@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@section('element')

    <div class="fileupload form-control" id="{{nameToId($name)}}" 
            data-fieldname="{{ $name }}"
            data-disk="{{ $disk }}"
            data-path="{{ $path }}"
            data-preservefilename="{{ $preserveFilename ? 'true':'false' }}"
            data-value="{{ json_encode($value) }}"
            data-chunksize="{{ $chunkSize }}"
            data-allowedsize="{{ $allowedSize }}"
        >

        <input type="file" class="fileupload-file" @if($accept) accept="{{ join(',', $accept) }}" @endif id="{{nameToId($name)}}-upload">

        <label class="fileupload-ui" for="{{ nameToId($name) }}-upload">
        
            <div class="fileupload-display">
                
                <A href="#" onclick="return false;" class="fileupload-reset bi-x-square-fill text-lg text-danger" style="font-size: 1.2rem; padding-right: 20px;"></A>
                
                <div class="fileupload-progress"></div>
                <div class="fileupload-text">
                    
                        Choose file
                    
                </div>

            </div>

        </label>
        <input type="hidden" name="{{$name}}" class="fileupload-value" id="{{nameToId($name)}}-value" :value="[]">
    
    </div>

@overwrite
