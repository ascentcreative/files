class ChunkableUploader {

    chunkSize = 60000000;
    chunkerId;

    constructor(data) {

        this.chunkerId = String(Date.now())+Math.floor(Math.random()*10000);

        for(var item in data) {
            this[item] = data[item];
        }
        
    }


    upload(file) {
        
        this.file = file;

        // work out how mnay chunks (rounded up)
        this.chunkCount = Math.ceil(file.size / this.chunkSize);
    

     // ** Uncomment from here to enable file checksumming **    
    //     let uploader = this;

    //     // work out the file checksum:
    //     let reader = new FileReader();
    //     reader.onload = function(e)  {
    //         data = e.target.result;
    //         uploader.checksum = md5(data);
    //         console.log('File Checksum: ' + uploader.checksum);
    //         uploader.startUpload();
    //     };

    //     reader.readAsBinaryString(file);

    // }
     

    // startUpload() {

        // ** Uncomment to here to enable file checksumming **
        
        this.uploadChunk();


        $(document).trigger('chunkupload-progress', {
            chunkerId: this.chunkerId,
            percentComplete: 0,
            loaded: 0,
            total: this.file.size,
            filename: this.file.name
        });

    }



    uploadChunk(idx=1) {

        if(idx > this.chunkCount) {
            throw new Error('Chunk ' + idx + ' out of bounds');
            return;
        }

        let uploader = this;
        let chunk = this.makeChunk(idx);


    // ** Uncomment from here to enable chunk checksumming **
    //      
    //     // work out the chunk checksum:
    //     let reader = new FileReader();
    //     reader.onload = function(e)  {
    //         data = e.target.result;
    //         // uploader.checksum = 
    //         console.log('first: ' + data[0]);
    //         console.log('last: ' + data[data.length - 1]);
    //         console.log('Chunk Checksum: ' + md5(data));
    //         uploader.doUploadChunk(chunk, idx, md5(data));
    //     };

    //     reader.readAsBinaryString(chunk);

    // }


    // doUploadChunk(chunk, idx, checksum) {
    // ** Uncomment to here to enable chunk checksumming **

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

        // ** Uncomment to add checksums to posted data **
        // formData.append('fileChecksum', this.checksum);
        // formData.append('chunkChecksum', checksum);


        $.ajax({
            xhr: function() {

                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("error", function(evt) {
                    console.log('Upload Error', evt);
                    $(document).trigger('chunkupload-error', {
                        chunkerId: uploader.chunkerId,
                        message: "An error occurred during upload."
                    });
                });
                
                //Upload progress
                xhr.upload.addEventListener("progress", function(evt){
            
                    // calc overall percentage:
                    let prevChunks = uploader.chunkSize * (idx-1);
                    let loaded = (prevChunks + evt.loaded);

                    // throw a new event
                    $(document).trigger('chunkupload-progress', {
                        chunkerId: uploader.chunkerId,
                        percentComplete: (loaded / uploader.file.size) * 100,
                        loaded: loaded,
                        total: uploader.file.size,
                        filename: uploader.file.name
                    });

                });
                return xhr;
            },
            cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                url: "/chunked-upload",
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                    'X-UPLOAD-TOKEN': uploader.token
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

                let message = ''

                switch(data.status) {
                    case 401:
                        message = 'Unauthorised';
                     break;

                    case 403:
                       message = 'You do not have permission to upload files';
                    break;

                    case 413:
                        message = 'The file is too large for the server to accept'; 
                    break;

                    default:
                        message = 'An unexpected error occurred';
                        break;
                }
                
                $(document).trigger('chunkupload-error', {
                    chunkerId: uploader.chunkerId,
                    data: data,
                    status: data.status,
                    message: message
                });
    
            });

    }

    makeChunk(idx) {

        let chunkStart = this.chunkSize * (idx-1);
        let chunkEnd = Math.min(chunkStart + this.chunkSize , this.file.size );

        let chunk = this.file.slice(chunkStart, chunkEnd);

        return chunk;

    }



}
