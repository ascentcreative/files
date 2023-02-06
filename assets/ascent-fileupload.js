// ******
// Single File Uploader
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2023


$.ascent = $.ascent?$.ascent:{};

var FileUpload = {
        
    options: {
        disk: 'files',
        path: '',
        preserveFilename: false,
        placeholder: 'Choose file',
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

        // console.log(obj);
       
        // alert($(obj).data('disk'));
       
        this.options.disk = $(obj).data('disk');
        this.options.path = $(obj).data('path');
        this.options.preserveFilename = $(obj).data('preservefilename');
        this.options.chunkSize = $(obj).data('chunksize');
        this.options.allowedSize = $(obj).data('allowedsize');
        // console.log($(obj).data());

        upl = $(this.element).find('input[type="file"]');

        // console.log($(this.element).data());

        // alert('init uplaoder');

        // if($(this.element).find('.data-item').length > 0) {
        //     $(this.element).addClass('has-file');
        // }

        if(data = $(this.element).data('value')) {
            this.setValue(data);
        }

        $(this.element).find('.fileupload-reset').on('click', function(e) {
            self.reset();
            e.stopPropagation();
        });
        
        $(upl).on('change', function() {

            self.reset();

            if(self.options.allowedSize > 0 && this.files[0].size > self.options.allowedSize) {
                self.setError(this.files[0].name + ' is too big (' + self.formatBytes(this.files[0].size) + '). Max = ' + self.formatBytes(self.options.allowedSize) );
                return;
            }

            uploader = new ChunkableUploader({
                'disk': self.options.disk,
                'path': self.options.path,
                'preserveFilename': self.options.preserveFilename?1:0,
                'chunkSize': self.options.chunkSize
            });

            $(document).on("chunkupload-progress", function(e, data) {
                
                if(data.chunkerId == uploader.chunkerId) {
                    // console.log('progress found', e, data);
                    self.updateUI('Uploading: ' + data.filename, data.percentComplete);
                    $(self.element).trigger('change');
                }

            });

            $(document).on("chunkupload-complete", function(e, data) {

                if(data.chunkerId == uploader.chunkerId) {
                    // console.log('comlpete found', e, data);
                    self.setValue(data.filemodel);
                    $(self.element).trigger('change');
                    // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
                }

            });

            $(document).on("chunkupload-error", function(e, data) {

                if(data.chunkerId == uploader.chunkerId) {
                    self.setError(data.message);
                }

            });

            uploader.upload(this.files[0]);

            $(self.element).addClass('block-submit');
            $(self.element).data('block-submit-message', "a file is currently uploading");
            
           
        });
        
        $(obj).addClass('initialised');


            //         self.setValue(data);

            //         $(self.element).trigger('change');
                  
            //   }).fail(function (data) {

            //     switch(data.status) {
            //         case 403:
            //             self.setError('You do not have permission to upload files');
            //             break;

            //         case 413:
            //             // alert('The file is too large for the server to accept');
            //             self.setError('The file is too large for the server to accept'); 
            //             break;

            //         default:
            //             // alert('An unexpected error occurred');
            //             self.setError('An unexpected error occurred');
            //             break;
            //     }


            //     // self.reset();

            //   });
          

        });
        
        $(obj).addClass('initialised');


    },

    setValue: function(data) { //value, text) {
        // $(this.element).find('.fileupload-value').val(value);

         // create a load of hidden text fields, holding the data items (allows for changes to the model?)
        for(key in data) {
            // console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + $(this.element).data('fieldname') + '[' + key + ']" value="' + data[key] + '">');
        }
        
        $(this.element).addClass('has-file');
        $(this.element).removeClass('block-submit');
        
        this.updateUI(data.original_filename, 0);

    },

    reset: function() {
        
        $(this.element).find('.data-item').remove();
        
        $(this.element).removeClass('has-file')
        $(this.element).removeClass('error');
        $(this.element).removeClass('block-submit');
        
        this.updateUI(this.options.placeholder, 0);

        // console.log(this.element);

        $(this.element).trigger('change');
    },

    updateUI: function(text, pct=0) {

        if (pct != 0) {
            pct = Math.min(Math.round(pct), 100);
        }

        var bar = $(this.element).find('.fileupload-progress');
      
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

   

}

$.widget('ascent.fileupload', FileUpload);
$.extend($.ascent.FileUpload, {
		 
		
}); 



// init on document ready
$(document).ready(function(){
    // alert('init blockselect');
    $('.fileupload').not('.initialised').fileupload();
});


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    // console.log(mutations, observer);
    // ...
    $('.fileupload').not('.initialised').fileupload();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  childList: true
  //...
});


