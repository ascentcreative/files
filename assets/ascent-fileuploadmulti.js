// ******
// Custom form component to enter & edit bible refs
// Expects incoming data from Laravel Eloquent
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2021


$.ascent = $.ascent?$.ascent:{};

var FileUploadMulti = {
        
    options: {
        disk: 'public',
        path: 'fileuploads',
        preserveFilename: 1,
        placeholder: 'Choose file',
        sortable: false,
        chunkSize: null,
        allowedSize: 0
    },
    
    _init: function () {
        
        var self = this;
        this.widget = this;
        
        idAry = (this.element)[0].id.split('-');
        
        var thisID = (this.element)[0].id;
        
        var fldName = idAry[1];
        
        var obj = this.element;

        this.options.disk = $(obj).data('disk');
        this.options.path = $(obj).data('path');
        this.options.preserveFilename = $(obj).data('preservefilename');
        this.options.data = obj.data('value');
        this.options.chunkSize = $(obj).data('chunksize');
        this.options.allowedSize = $(obj).data('allowedsize');

        if(this.options.data) {
            for(file in this.options.data) {
                this.createFileBlock(this.options.data[file]);
            }
            this.updateFileIndexes();
        }
    
        upl = $(this.element).find('input[type="file"]');

        if($(this.element).find('.fileupload-value').val() != '') {
            $(this.element).addClass('has-file');
        }

       
         upl.on('change', function() {

            // for each file selected, create a new uploader bar and show progress as it uploads.

            for(var iFile = 0; iFile < this.files.length; iFile++ ) {

                var item = self.createFileBlock();
                $(item).fileuploadmultifile('upload', this.files[iFile]);

            }               
                
         });

         if (this.options.sortable) {
            $(this.element).sortable({
                update: function(event, ui) {
                    self.updateFileIndexes();
                    ui.item.find('input').change();
                }
            });
        }
        

         $(this.element).on('change', function() {
            // console.log('change handler');
            self.updateFileIndexes();
         });
        

    },

 


    createFileBlock: function(data) {
        
        template = $('template#fileuploadmulti-item');
        item = $(template.html());
        $(this.element).append(item);
        $(item).fileuploadmultifile({
            disk: this.options.disk,
            path: this.options.path,
            preserveFilename: this.options.preserveFilename,
            fieldname: this.element.attr('name'),
            chunkSize: this.options.chunkSize,
            allowedSize: this.options.allowedSize
        });
        if(data) {
            // console.log('setting data');
            // console.log(data);
            $(item).fileuploadmultifile('setValue', data); //, data.id , data.original_name);
        }

        return item;

    },


    updateFileIndexes: function() {

        fldname = this.element.attr('name');
        
        $(this.element).find('.fileuploadmulti-ui').each(function(index) {
            var prefix = fldname + "[" + index + "]";
            // console.log('prefix: ' + prefix);
            $(this).find("input").each(function() {

                esc = fldname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                re = new RegExp(esc + "\\[\\d+\\]");
               this.name = this.name.replace(re, prefix);   
            });
        });

    }



   

}

$.widget('ascent.fileuploadmulti', FileUploadMulti);
$.extend($.ascent.FileUploadMulti, {
		 
		
}); 




var FileUploadMultiFile = {

    options: {
        disk: 'public',
        path: 'fileuploads',
        preserveFilename: false,
        fieldname: '',
        chunkSize: null,
        allowedSize: 0
    },

    _init: function() {
        // console.log("INIT FILE");
        // console.log('this', this.element);
        var self = this;

        $(this.element).find('.fileupload-reset').on('click', function() {
            let parent = $(self.element).parents('.fileuploadmulti');
            $(self.element).remove();
            // fire a change event
            // alert(self.options.fieldname);
            $(parent).trigger('change');
        });

    },


    setValue: function(data) { //value, text) {

        // console.log(data);
        //$(this.element).find('.fileuploadmulti-id').val(value);
        //$(this.element).find('.fileuploadmulti-label').val(text);

          // create a load of hidden text fields, holding the data items (allows for changes to the model?)
        for(key in data) {
            // console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + this.options.fieldname + '[9999][' + key + ']" value="' + data[key] + '">');
        }

        $(this.element).removeClass('uploading').addClass('has-file');
        this.updateUI(data.original_filename, 0);

        // fire a change event
        $(this.element).find('.fileuploadmulti-label').change();

    },


    updateUI: function(text, pct=null) {

        if (pct != 0) {
            pct = Math.min(Math.round(pct), 100);
        }

        var bar = $(this.element).find('.fileupload-progress');
        // console.log(bar);
        // console.log( (100 - pct) + '%');
        bar.css('right', (100 - pct) + '%');

        if (pct != 0) {
            if(pct == 100) {
                text = text + ' <strong>(Processing - please wait...)</strong>';
            } else {
                text = text + ' (' + pct + "%)";
            }
        }

        $(this.element).find('.fileupload-text').html(text);

    },

    setError: function(text) {
        $(this.element).addClass('error').find('.fileupload-text').html(text);   
    },

    upload: function(file) {

        let self = this;

        $(self.element).addClass('uploading');

        // console.log(self.options);

        if(self.options.allowedSize > 0 && file.size > self.options.allowedSize) {
            self.setError(file.name + ' is too big (' + self.formatBytes(file.size) + '). Max = ' + self.formatBytes(self.options.allowedSize) );
            return;
        }

        this.uploader = new ChunkableUploader({
            'disk': self.options.disk,
            'path': self.options.path,
            'preserveFilename': self.options.preserveFilename?1:0,
            'chunkSize': self.options.chunkSize
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


    // oldupload: function(file) {

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
                
    //             //self.setUploadState();
    //             //Upload progress
    //             xhr.upload.addEventListener("progress", function(evt){
                
    //                 if (evt.lengthComputable) {
    //                 var percentComplete = (evt.loaded / evt.total) * 100;
    //                 //Do something with upload progress
    //                 //prog.find('PROGRESS').attr('value', percentComplete);
    //                 self.updateUI('Uploading: ' + Math.round(percentComplete) + "%", percentComplete);
    //                 console.log(percentComplete);

    //                 }
    //             }, false);
    //             return xhr;
    //         },
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //         type: 'POST',
    //         url: "/file-upload",
    //         data: formData,
    //         headers: {
    //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //         }

    //     }).done(function(data, xhr, request){

                
    //             //Do something success-ish
    //             //$(obj).parents('FORM').unbind('submit', blocksubmit);
    //             //console.log(data);
    //             // $('INPUT[type=submit]').prop('disabled', false).val($('INPUT[type="submit"]').data('oldval')).css('opacity', 1);
    //             // prog.remove();
    //             // upl.remove();

    //         // self.updateUI(data.original_name + ' : Upload Complete', 0, 'value');
    //             //$(self.element).find('.fileupload-value').val(data.id);
    //             self.setValue(data); //data.id, data.original_name);

    //             console.log(data);

    //             $(self.element).trigger('change');


    //             //   var result = $.parseJSON(data);
    //             //   //console.log(result);
    //             //   if(result['result'] == 'OK') {
    //             //       obj.find('#' + self.fldName + '-filename').val(result['file']);
    //             //       self.setCompleteState();
    //             //   } else {
                    
    //             //   }

            
    //     }).fail(function (data) {

    //         switch(data.status) {
    //             case 403:
    //                 self.setError('You do not have permission to upload files');

    //             //   self.updateUI('You do not have permission to upload files', 0, 'error');

    //                 break;

    //             case 413:
    //                 self.setError('The file is too large for the server to accept');
    //                 //self.updateUI('The file is too large for the server to accept', 0, 'error');
    //                 break;

    //             default:
    //                 self.setError('An unexpected error occurred');
    //                 //self.updateUI('An unexpected error occurred', 0, 'error');
    //                 break;
    //         }

    //     });


    // }

}


$.widget('ascent.fileuploadmultifile', FileUploadMultiFile);
$.extend($.ascent.FileUploadMultiFile, {
		 
		
}); 