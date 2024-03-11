<div class="files-previewer">
    @if($pageCount == -99)
        <div class="text-center p-3 text-muted">
        <strong>Error displaying file</strong><br/>
        <small>No previewer found for '{{ $file->original_filename }}'</small>
        </div>
    @endif

    @for($iPage = 0; $iPage < $pageCount; $iPage++)

        <img src="{{ route('image.display', ['spec'=>'max', 'filename'=>$file->hashed_filename, 'idx'=>$iPage]) }}"
            style="object-fit: fill; max-width: 100%; xmax-height: 100%"
            >

    @endfor
</div>
