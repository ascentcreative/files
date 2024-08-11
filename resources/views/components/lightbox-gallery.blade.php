@include('files::components.lightbox-setup')
<div class="files-lightbox-gallery">
    @foreach($images as $image) 
        <x-files-lightbox-image :image="$image" />
    @endforeach
</div>