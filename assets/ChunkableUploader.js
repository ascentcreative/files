class ChunkableUploader {

    chunkSize = 60000000;
    chunkerId;

    constructor(data) {

        this.chunkerId = String(Date.now())+Math.floor(Math.random()*10000);

        for(var item in data) {
            this[item] = data[item];
        }

        // console.log(this);
    }


    upload(file) {
        
        // console.log(file.name);

        this.file = file;

        // work out how mnay chunks (rounded up)
        this.chunkCount = Math.ceil(file.size / this.chunkSize);
        // let i = 0;
        // while( i < this.chunkCount) {
        //     this.makeChunk(i);
        //     i++;
        // }   
        
        this.uploadChunk();

    }



    uploadChunk(idx=1) {

        // console.log('Starting chunk ' + idx);

        if(idx > this.chunkCount) {
            throw new Error('Chunk ' + idx + ' out of bounds');
            return;
        }

        let uploader = this;
        let chunk = this.makeChunk(idx);

        

        var formData = new FormData(); 
        formData.append('payload', chunk, this.file.name); 
        formData.append('chunkIdx', idx);
        formData.append('chunkCount', this.chunkCount);
        formData.append('totalSize', this.file.size);
        formData.append('chunkSize', chunk.size);
        formData.append('chunkerId', this.chunkerId);
        formData.append('disk', this.disk);
        formData.append('path', this.path);
        formData.append('preserveFilename', this.preserveFilename);


        $.ajax({
            xhr: function() {

                var xhr = new window.XMLHttpRequest();
                
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){

                    console.log(evt);
            
                    // calc overall percentage:
                    let prevChunks = uploader.chunkSize * (idx-1);
                    let loaded = (prevChunks + evt.loaded);

                    $(document).trigger('chunkupload-progress', {
                        chunkerId: uploader.chunkerId,
                        percentComplete: (loaded / uploader.file.size) * 100,
                        loaded: loaded,
                        total: uploader.file.size,
                        filename: uploader.file.name
                    });

                    // }
                }, false);
                return xhr;
            },
            cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                url: "/chunked-upload",
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
                
              }).done(function(data, xhr, request){
           
                if(parseInt(data.chunkIdx) < uploader.chunkCount) {
                    uploader.uploadChunk(parseInt(data.chunkIdx)+1);
                } else {

                    $(document).trigger('chunkupload-complete', {
                        chunkerId: uploader.chunkerId,
                        filemodel: data
                    });

                }
                  
            }).fail(function (data) {

                // console.log('ERROR', data);

                let message = ''

                switch(data.status) {
                    case 403:
                       message = 'You do not have permission to upload files';
                    break;

                    case 413:
                        // alert('The file is too large for the server to accept');
                        message = 'The file is too large for the server to accept'; 
                    break;

                    default:
                        // alert('An unexpected error occurred');
                        message = 'An unexpected error occurred';
                        break;
                }
                
                $(document).trigger('chunkupload-error', {
                    chunkerId: uploader.chunkerId,
                    data: data,
                    status: data.status,
                    message: message
                });

                //     
    
                //     // self.reset();
    
            });

    }

    makeChunk(idx) {

        let chunkStart = this.chunkSize * (idx-1);
        let chunkEnd = Math.min(chunkStart + this.chunkSize , this.file.size );

        // console.log('chunking: ', idx, chunkStart, chunkEnd);

        let chunk = this.file.slice(chunkStart, chunkEnd);

        return chunk;

        // console.log(chunk)

    }



}
