// ******
// Custom form component to enter & edit bible refs
// Expects incoming data from Laravel Eloquent
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2021

// alert('ok');
$.ascent = $.ascent?$.ascent:{};

var GalleryUpload = {

    uploader: null,
        
    options: {
        disk: 'files',
        path: '',
        preserveFilename: 0,
        placeholder: 'Choose file',
        sortable: true,
        maxFiles: 0,
        chunkSize: null,
        token: null,
        configtoken: null
    },
    
    _init: function () {

        // console.log('init');
        
        var self = this;
        this.widget = this;
        
        idAry = (this.element)[0].id.split('-');
        
        var thisID = (this.element)[0].id;
        
        var fldName = idAry[1];
        
        var obj = this.element;
        

        this.options.chunkSize = $(obj).data('chunksize');
        this.options.maxFiles = $(this.element).data('maxfiles');
        this.options.token = $(this.element).data('token');
        this.options.configtoken = $(this.element).data('configtoken');

        // console.log(obj.data('value'));

        for(file in obj.data('value')) {
            
            this.createFileBlock(obj.data('value')[file]);

        }
    
        upl = $(this.element).find('input[type="file"]');

        // console.log('upl', upl);

        if($(this.element).find('.galleryupload-value').val() != '') {
            $(this.element).addClass('has-file');
        }


        $(this.element).on('click', 'label.button', function() {
            let max = self.options.maxFiles;
            if(max != 0) {
                let count = $(self.element).find('.galleryupload-ui').length;

                if(count >= max) {
                    alert("You may only add " + max + " image" + (max > 1 ? "s" : ""));
                    return false;
                }
            }
        });

       
        upl.on('change', function() {

            // for each file selected, create a new uploader bar and show progress as it uploads.

            // check we've not just spammed with a massive selection:
            let max = self.options.maxFiles;
            let count = $(self.element).find('.galleryupload-ui').length + this.files.length;
            if(max != 0 && count > max) {
                alert("You may only add " + max + " image" + (max > 1 ? "s" : ""));
                return false;
            }

            for(var iFile = 0; iFile < this.files.length; iFile++ ) {

                var item = self.createFileBlock();
                $(item).galleryuploaditem('upload', this.files[iFile]);

            }               

            $(this).val('');

        });


         if (this.options.sortable) {
            $(this.element).find('.galleryupload-items').sortable({
                update: function(event, ui) {
                    self.updateFileIndexes();
                    ui.item.find('input').change();
                }
            });
        }


        $(this.element).on('click', '.galleryupload-remove', function() {
            $(this).parents('.galleryupload-item').remove();
            self.updateFileIndexes();
        });
        
        $(this.element).on('change', function() {
            // console.log('change handler');
            self.updateFileIndexes();
         });
        

    },

 


    createFileBlock: function(data) {

        // console.log('Create File Block');
        // console.log(data);
        // return;

        fldname = this.element.attr('name');

        template = $('template#galleryupload-item-' + fldname);
        item = $(template.html());
        $(this.element).find('.galleryupload-items').append(item);
        $(item).galleryuploaditem({
            disk: this.options.disk,
            path: this.options.path,
            preserveFilename: this.options.preserveFilename,
            fieldname: this.element.attr('name'),
            chunkSize: this.options.chunkSize,
            token: this.options.token,
            configtoken: this.options.configtoken
        });
        if(data) {
            // console.log('setting data');
            // console.log(data);
            $(item).galleryuploaditem('setValue', data); //.id , data.original_filename);
        }

        this.updateFileIndexes();

        return item;

    },


    updateFileIndexes: function() {

        fldname = this.element.attr('name');

        console.log('fldname:' + fldname);
     
        $(this.element).find('.galleryupload-ui').each(function(index) {
            var prefix = fldname + "[" + index + "]";
            console.log(prefix);
            console.log($(this.element).find("input"));
            $(this).find("input").each(function() {
                console.log(this.name);
                esc = fldname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                re = new RegExp(esc + "\\[\\d+\\]");

                this.name = this.name.replace(re, prefix);   
            });
        });

    }

}

$.widget('ascent.galleryupload', GalleryUpload);
$.extend($.ascent.GaleryUpload, {
		 
		
}); 




var GalleryUploadItem = {

    options: {
        disk: 'public',
        path: 'galleryuploads',
        preserveFilename: false,
        fieldname: '',
        chunkSize: null,
        token: null,
        configtoken: null
    },

    _init: function() {

        // console.log("INIT FILE");
        // console.log('this', this.element);
        var self = this;

    },


    setValue: function(data) { //}, text) {

        // console.log('setting value');
        // console.log(value); //, text);
        // console.log($(this.element).find('.galleryupload-image'));
        // $(this.element).find('.galleryupload-id').val(value.id);
        // $(this.element).find('.galleryupload-original_filename').val(value.original_filename);
        // $(this.element).find('.galleryupload-hashed_filename').val(value.hashed_filename);

          // create a load of hidden text fields, holding the data items (allows for changes to the model?)
          for(key in data) {
            // console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + this.options.fieldname + '[9999][' + key + ']" value="' + data[key] + '">');
        }

        $(this.element).find('.galleryupload-image').css('background-image', "url('/image/preview/" + data.hashed_filename + "')");
        $(this.element).addClass('has-file');
        this.updateUI(data.original_filename, 0);

        // fire a change event
        $(this.element).find('.galleryupload-label').change();

    },

    setError: function(text) {
        $(this.element).addClass('error').find('.fileupload-text').html(text);   
    },

    updateUI: function(text, pct=0) {

        var bar = $(this.element).find('.galleryupload-progress');
        // console.log(bar);
        // console.log( (100 - pct) + '%');
        bar.css('right', (100 - pct) + '%');

        $(this.element).find('.galleryupload-text').html(text);

    },


    upload: function(file) {

        let self = this;

        $(self.element).addClass('uploading');

        console.log('opts: ', self.options);

        console.log(file);

        // console.log(self.options);

        if(self.options.allowedSize > 0 && file.size > self.options.allowedSize) {
            self.setError(file.name + ' is too big (' + self.formatBytes(file.size) + '). Max = ' + self.formatBytes(self.options.allowedSize) );
            return;
        }

        this.uploader = new ChunkableUploader({
            'disk': self.options.disk,
            'path': self.options.path,
            'preserveFilename': self.options.preserveFilename?1:0,
            'chunkSize': self.options.chunkSize,
            'token': self.options.token,
            'configtoken': self.options.configtoken
        });

        $(document).on("chunkupload-progress", function(e, data) {

            // console.log(data.chunkerId + ' - ' + self.uploader.chunkerId);
                
            if(data.chunkerId == self.uploader.chunkerId) {
                // console.log('progress found', e, data);
                self.updateUI('Uploading: ' + data.filename, data.percentComplete);
                $(self.element).trigger('change');
            }

        });

        $(document).on("chunkupload-complete", function(e, data) {

            if(data.chunkerId == self.uploader.chunkerId) {
                // console.log('comlpete found', e, data);
                self.setValue(data.filemodel);
                $(self.element).trigger('change');
                // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
            }

        });

        $(document).on("chunkupload-error", function(e, data) {

            if(data.chunkerId == self.uploader.chunkerId) {
                self.setError(data.message);
            }

        });

        this.uploader.upload(file);

    },

    formatBytes: function(bytes) {

        var sizes = [' Bytes', ' KB', ' MB', ' GB',
                    ' TB', ' PB', ' EB', ' ZB', ' YB'];
            
        for (var i = 1; i < sizes.length; i++) {
            if (bytes < Math.pow(1024, i))
            return (Math.round((bytes / Math.pow(
                1024, i - 1)) * 100) / 100) + sizes[i - 1];
        }
        return bytes;
    }



    // upload: function(file) {

    //     var self = this;

      
    //     var formData = new FormData(); 
    //     formData.append('payload', file); 
    //     formData.append('disk', self.options.disk);
    //     formData.append('path', self.options.path);
    //     formData.append('preserveFilename', self.options.preserveFilename);

    //     $.ajax({
    //         xhr: function()
    //         {
                
    //         var xhr = new window.XMLHttpRequest();
            
    //         //self.setUploadState();
    //         //Upload progress
    //         xhr.upload.addEventListener("progress", function(evt){
            
    //             if (evt.lengthComputable) {
    //             var percentComplete = (evt.loaded / evt.total) * 100;
    //             //Do something with upload progress
    //             //prog.find('PROGRESS').attr('value', percentComplete);
    //             self.updateUI('Uploading...', percentComplete);
    //             // console.log(percentComplete);

    //             }
    //         }, false);
    //         return xhr;
    //         },cache: false,
    //         contentType: false,
    //         processData: false,
    //         type: 'POST',
    //         url: "/file-upload",
    //         data: formData

    //     }).done(function(data, xhr, request){

                
    //         //Do something success-ish
    //         self.setValue(data); //.id, data.original_name);

    //         // console.log(data);

    //         $(self.element).trigger('change');

  
    //     }).fail(function (data) {

    //         switch(data.status) {
    //             case 403:
    //                 alert('You do not have permission to upload files');

    //             //   self.updateUI('You do not have permission to upload files', 0, 'error');

    //                 break;

    //             case 413:
    //                 alert('The file is too large for the server to accept');
    //                 //self.updateUI('The file is too large for the server to accept', 0, 'error');
    //                 break;

    //             default:
    //                 alert('An unexpected error occurred');
    //                 //self.updateUI('An unexpected error occurred', 0, 'error');
    //                 break;
    //         }

    //     });


    // }

}


$.widget('ascent.galleryuploaditem', GalleryUploadItem);
$.extend($.ascent.GalleryUploadItem, {
		 
		
}); 


