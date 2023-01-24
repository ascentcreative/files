@extends('forms::components.wrappers.' . $wrapper)

@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@section('element')

    <div class="p-3 bg-light border">

    <div class="fileuploadmulti" id="{{nameToId($name)}}"" name="{{ $name }}" 
        data-fieldname="{{ $name }}"
        data-value="{{ json_encode($value) }}"
        data-sortable="{{ $sortable ? 'true' : 'false' }}"
        data-disk="{{ $disk }}"
        data-path="{{ $path }}"
        data-preservefilename="{{ $preserveFilename ? 'true':'false' }}"
        >
        <input type="file" multiple class="fileupload-file" accept="{{ join(',', $accept) }}" id="{{nameToId($name)}}-upload">        
    </div>

    <label class="button btn btn-primary btn-sm bi-plus-circle-fill mb-0" for="{{ nameToId($name) }}-upload">
        Add Files
    </label>
    </div>


    {{-- Tempted to set this as a template, and have the jQuery Widget control creation 
        of them at runtime (both on load, and when new files are added) --}}

    <template id="fileuploadmulti-item">
        <div class="fileuploadmulti-ui fileupload-ui form-control">
            <div class="fileupload-display">
                
                <A href="#" onclick="return false;" class="fileupload-reset bi-x-square-fill text-lg text-danger" style="font-size: 1.2rem; padding-right: 20px;"></A>
                <div class="fileupload-progress"></div>
                <div class="fileupload-text"></div>

            </div>

            {{-- <input type="hidden" name="{{$name}}[999][id]" class="fileuploadmulti-id" xid="{{nameToId($name)}}-id" value="">
            <input type="hidden" name="{{$name}}[999][original_name]" class="fileuploadmulti-label" xid="{{nameToId($name)}}-label" value=""> --}}
        </div> 
    </template>


@overwrite


@push('scripts')
    <script>
        $(document).ready(function() {
            $('#{{ nameToId($name) }}').fileuploadmulti({
   
               
            });
        });
    </script>
@endpush