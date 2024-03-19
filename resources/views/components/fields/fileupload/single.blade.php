@extends('forms::components.wrappers.' . $wrapper)

@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@section('element')

    @if($attributes['readonly'])

        <div class="col-form-label p-2" style="min-height: 2.5em;">
            @if($value)
                @include('files::components.fields.fileupload.readonly.' . $value->mediaType)
            @else
                <span class="text-muted">[Not Uploaded]</span>
            @endif
        </div>

    @else
   

        <div class="fileupload xform-control" id="{{nameToId($name)}}" 
                data-fieldname="{{ $name }}"
                data-disk="{{ $disk }}"
                data-path="{{ $path }}"
                data-preservefilename="{{ $preserveFilename ? 'true':'false' }}"
                data-value="{{ json_encode($value) }}"
                data-chunksize="{{ $chunkSize }}"
                data-allowedsize="{{ $allowedSize }}"
                data-token="{{ $token }}"
            >

            <div class="form-control">

                <input type="file" class="fileupload-file" @if($accept) accept="{{ join(',', $accept) }}" @endif name="{{ $name }}[upload]" id="{{nameToId($name)}}-upload">

                <label class="fileupload-ui" for="{{ nameToId($name) }}-upload">
        
                    <div class="fileupload-display">
                        
                        <A href="#" onclick="return false;" class="fileupload-reset bi-trash-fill button btn btn-primary xbi-x-square-fill text-lg xtext-primary"></A>
                        
                        <div class="fileupload-progress"></div>
                        <div class="fileupload-text">
                            
                                Choose file
                            
                        </div>

                    </div>

                </label>
            </div>
            <input type="hidden" name="{{$name}}" class="fileupload-value" id="{{nameToId($name)}}-value" :value="[]">
        
            
        </div>

    @endif
   
@overwrite
