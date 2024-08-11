@once
    @push('scripts')
        <script>
            lightbox.option({
                @foreach($options as $opt=>$val)
                    '{{ $opt }}': {{ $val }},
                @endforeach
            });
        </script>
    @endpush
@endonce
