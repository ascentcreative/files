@extends('forms::components.wrappers.' . $wrapper)

@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@section('element')

    {{-- @dump(json_encode($value)) --}}

    <div class="p-3 bg-light border gallery-upload" id="{{nameToId($name)}}" name="{{ $name }}" data-value="{{ json_encode($value) }}"
        data-maxfiles="{{ $maxFiles}}"
    
        >
        <input type="hidden" name="{{ $name }}" value=""/>
        <div class="galleryupload-items">
            <input type="file" multiple class="galleryupload-file" accept="image/*" id="{{nameToId($name)}}-upload">        
        </div>
        
        <div style="clear: both">
        <label class="button btn btn-primary btn-sm bi-plus-circle-fill mb-0" for="{{ nameToId($name) }}-upload" >
            Add Files
        </label>
        </div>

        <template id="galleryupload-item-{{$name}}">
            <div class="galleryupload-ui galleryupload-item border rounded bg-white xform-control mb-2">
                
                <div class="galleryupload-display xd-flex p-2">
                    
                    <div class="galleryupload-progress"></div>

                    <div class="galleryupload-image" style=""></div>

                    <div class="galleryupload-text"></div>
                    
                    <A href="#" onclick="return false;" class="galleryupload-remove bi-x-square-fill text-lg text-danger"></A>
    
                </div>
    
                {{-- <input type="hidden" name="{{$name}}[999][id]" class="galleryupload-id" value="">
                <input type="hidden" name="{{$name}}[999][original_filename]" class="galleryupload-original_filename" value="">
                <input type="hidden" name="{{$name}}[999][hashed_filename]" class="galleryupload-hashed_filename" value=""> --}}
            </div> 
        </template>

    </div>

@overwrite

@once
    @push('styles')
        @style('/vendor/ascent/files/ascent.images.galleryupload.css')
    @endpush
    @push('scripts')
        @script('/vendor/ascent/files/ascent.images.galleryupload.js')
        <script>
            $('.gallery-upload').galleryupload();
        </script>
    @endpush
@endonce