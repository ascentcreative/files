<audio class="read-only-file-component" controls>
    <source src="{{ route('file.stream', ['file'=>$value])}}" type="{{ $value->mime_type }}">
</audio>