<div class="files-previewer">
    @for($iPage = 0; $iPage < $pageCount; $iPage++)

        <img src="{{ route('image.display', ['spec'=>'max', 'filename'=>$file->hashed_filename, 'idx'=>$iPage]) }}"
            style="object-fit: fill; max-width: 100%; xmax-height: 100%"
            >

    @endfor
</div>
