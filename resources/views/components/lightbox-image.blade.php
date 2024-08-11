@include('files::components.lightbox-setup')
<a href="{!! route('image.display', ['spec'=>'max', 'filename'=>$image->hashed_filename]) !!}"  data-lightbox="lightbox">
    <img class="" src="{!! route('image.display', ['spec'=>'300x300', 'filename'=>$image->hashed_filename]) !!}">
</a>
