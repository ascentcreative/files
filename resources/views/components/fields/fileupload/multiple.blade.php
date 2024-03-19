@extends('forms::components.wrappers.' . $wrapper)

@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@section('element')

    {{-- 
        TODO: This is a weird structure - the outer tag should be the widget, not some hard-coded styling
        You can tell I got a bit bootstrap-happy here...
         --}}
    <div class="p-3 bg-light border fileupload-outer">

    <div class="fileuploadmulti" id="{{nameToId($name)}}"" name="{{ $name }}" 
        data-fieldname="{{ $name }}"
        data-value="{{ json_encode($value) }}"
        data-sortable="{{ $sortable ? 'true' : 'false' }}"
        data-disk="{{ $disk }}"
        data-path="{{ $path }}"
        data-preservefilename="{{ $preserveFilename ? 'true':'false' }}"
        data-chunksize="{{ $chunkSize }}"
        data-allowedsize="{{ $allowedSize }}"
        data-token="{{ $token }}"
        >
        <input type="file" multiple class="fileupload-file" accept="{{ join(',', $accept) }}" id="{{nameToId($name)}}-upload-{{ $unid = uniqid() }}">        
        <input type="hidden" value="" name="{{ $name }}" />
    </div>

    <label class="button btn btn-primary btn-sm bi-plus-circle-fill mb-0" for="{{ nameToId($name) }}-upload-{{ $unid }}">
        Add Files
    </label>
    </div>


    {{-- Tempted to set this as a template, and have the jQuery Widget control creation 
        of them at runtime (both on load, and when new files are added) --}}

    <template id="fileuploadmulti-item">
        <div class="fileuploadmulti-ui fileupload-ui form-control">
            <div class="fileupload-display">
                
                <A href="#" onclick="return false;" class="fileupload-reset button btn btn-primary bi-trash-fill xbi-x-square-fill xtext-lg xtext-danger"></A>
                <div class="fileupload-progress"></div>
                <div class="fileupload-text"></div>

            </div>

            {{-- <input type="hidden" name="{{$name}}[999][id]" class="fileuploadmulti-id" xid="{{nameToId($name)}}-id" value="">
            <input type="hidden" name="{{$name}}[999][original_name]" class="fileuploadmulti-label" xid="{{nameToId($name)}}-label" value=""> --}}
        </div> 
    </template>


@overwrite

{{-- 
@push('scripts')
    <script>
        $(document).ready(function() {
            $('#{{ nameToId($name) }}').fileuploadmulti({
   
               
            });
        });
    </script>
@endpush --}}