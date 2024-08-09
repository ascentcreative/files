<div class="file-links">
@foreach($files as $file)
    <x-file-link :file="$file"/>
@endforeach
</div>