

{{-- Need a component which will count pages and display the relevant number of image tags... --}}
<img src="{{ route('image.display', ['spec'=>'max', 'filename'=>$file->hashed_filename, 'idx'=>0]) }}"
style="object-fit: fill; max-width: 100%; xmax-height: 100%"
>
{{-- 
<img src="{{ route('image.display', ['spec'=>'max', 'filename'=>$file->hashed_filename, 'idx'=>1]) }}"
style="object-fit: fill; max-width: 100%; xmax-height: 100%"
>

<img src="{{ route('image.display', ['spec'=>'max', 'filename'=>$file->hashed_filename, 'idx'=>2]) }}"
style="object-fit: fill; max-width: 100%; xmax-height: 100%"
> --}}