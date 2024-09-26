@extends('cms::components.form.wrapper.' . $wrapper)


@section('label'){{$label}}@overwrite
@section('name'){{$name}}@overwrite

@php $unid = 'fld-' . uniqid(); @endphp

@section('element')

    <div id="croppie-frame" class="croppie-upload border bg-white rounded" xstyle="width: 250px; height: 250px;"
        data-fieldname="{{ $name }}"
        data-token="{{ $token }}"
        data-value="{{ json_encode($value) }}"
        >

       

        <img src="" class="img-preview" />

        <div class="placeholder">Click to upload image</div>

        <label style="">
            <input type="file" class="croppie-file" accept="image/*"/>
        </label>
      

        <x-cms-modal modalid="modal-{{ $unid }}" centered="true" :showFooter="false" :showHeader="false">

            <p><strong>Crop your image</strong></p>

            <div class="croppie">
            
            </div>

            <div class="flex flex-center" style="gap: 1rem">
                <button class="btn button btn-secondary btn-cancel" data-dismiss="modal">Cancel</button>
                <button class="btn button btn-primary btn-ok">OK</button>
            </div>
    
            <x-slot name="footer">
               
            </x-slot>
        </x-cms-modal>

    </div>

@overwrite

@push('scripts')
<script>

</script>
@endpush


@once
    @push('scripts')
        @scripttag('/vendor/ascent/files/ascent-croppieupload.js')
    @endpush
    @push('styles')
        {{-- @style('/vendor/ascent/cms/form/components/croppie/croppie.css') --}}
        @style('/vendor/ascent/files/ascent-croppieupload.css')
    @endpush
@endonce