<a class="file-link" href="{{ route('file.stream', ['file'=>$file]) }}">
    <span class="file-label">{{ $file->label ?? $file->original_filename }}</span>
    <span class="file-size">{{ $file->sizeHuman }}</span>
</a>