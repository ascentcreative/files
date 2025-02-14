// ******
// Single File Uploader
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2023
$.ascent = $.ascent?$.ascent:{};

var FileUpload = {

    uploader: null,
        
    options: {
        disk: 'files',
        path: '',
        preserveFilename: false,
        placeholder: 'Choose file',
        chunkSize: null,
        allowedSize: 0,
        token: null,
        configtoken: null
    },
    
    _init: function () {
        
        var self = this;
        this.widget = this;
        
        idAry = (this.element)[0].id.split('-');
        
        var thisID = (this.element)[0].id;
        
        var fldName = idAry[1];
        
        var obj = this.element;

        $(obj).addClass('initialised');

        console.log('Upload INIT');

        // console.log(obj);
       
        // alert($(obj).data('disk'));
       
        this.options.disk = $(obj).data('disk');
        this.options.path = $(obj).data('path');
        this.options.preserveFilename = $(obj).data('preservefilename');
        this.options.chunkSize = $(obj).data('chunksize');
        this.options.allowedSize = $(obj).data('allowedsize');
        this.options.token = $(obj).data('token');
        this.options.configtoken = $(obj).data('configtoken');
        // console.log($(obj).data());

        upl = $(this.element).find('input[type="file"]');

        console.log('file upload value on init', $(this.element).data('value'));
        if(data = $(this.element).data('value')) {
            this.setValue(data);
        }

        $(this.element).find('.fileupload-reset').on('click', function(e) {
            $(self.element).find('input[type="file"]').val('');
            self.reset();
            e.stopPropagation();
        });
        
        $(upl).on('change', function() {

            console.log('fileupload - change');

            self.reset();

            if(self.options.allowedSize > 0 && this.files[0].size > self.options.allowedSize) {
                self.setError(this.files[0].name + ' is too big (' + self.formatBytes(this.files[0].size) + '). Max = ' + self.formatBytes(self.options.allowedSize) );
                return;
            }

            self.uploader = new ChunkableUploader({
                'disk': self.options.disk,
                'path': self.options.path,
                'preserveFilename': self.options.preserveFilename?1:0,
                'chunkSize': self.options.chunkSize,
                'token': self.options.token,
                'configtoken': self.options.configtoken
            });

            
            $(document).on("chunkupload-progress", function(e, data) {

                $(self.element).addClass('file-uploading');

                if(data.chunkerId == self.uploader.chunkerId) {
                    self.updateUI('Uploading: ' + data.filename, data.percentComplete);
                    $(self.element).trigger('change');
                    
                }

            });

            $(document).on("chunkupload-complete", function(e, data) {

                console.log(data);
                $(self.element).removeClass('file-uploading');

                if(data.chunkerId == self.uploader.chunkerId) {
                    // console.log('comlpete found', e, data);
                    self.setValue(data.filemodel);
                    $(self.element).trigger('change');
                    $(self.element).trigger({
                            type: 'upload-complete',
                            filedata: data.filemodel,
                    });
                    // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
                }

            });

            $(self.element).trigger({
                type: 'upload-start',
            });

            $(document).on("chunkupload-error", function(e, data) {

                $(self.element).removeClass('file-uploading');
                if(data.chunkerId == self.uploader.chunkerId) {
                    self.setError(data.message);
                }

            });

            self.uploader.upload(this.files[0]);

            $(self.element).addClass('block-submit');
            $(self.element).data('block-submit-message', "a file is currently uploading");
            
           
        });
        
  


        // handlers for server browse popup:
        
        // detect click on the link - register a handler for the "Select" button (+ maybe a dbl click on a file)

        // - handler should obtain the data for the selected file to populate the field with

        // Borrowed from HasMany to ensure all handlers are kept to a minimum:
         /**
             * Catches all the dialog close events and removes the handlers for this widget
             * (Doesn't matter if it fires inbetween)
             * (Tried using one(), but this means the handlers don't get removed if the modal is cancelled)
             */
        //  $(document).on('hidden.bs.modal', '#ajaxModal', self.clearHandlers);
        // console.log("Reg Mutation Observer");
        //   // Mutation Observer - if the field names are changed, update the element data-fieldname too
        //   MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        //   var obs_name = new MutationObserver(function(mutations, observer) {
        //       // fired when a mutation occurs
        //       // console.log(mutations, observer);
        //       // ...
        //       alert('CHANGE! ' + $(self.element).find('input.fileupload-value').attr('name'));
        //       self.element.data('fieldname', $(self.element).find('input.fileupload-value').attr('name'))
        //   });
  
        //   // define what element should be observed by the observer
        //   // and what types of mutations trigger the callback
        //   obs_name.observe($(this.element).find('input.fileupload-value')[0], {
        //       attributes: true,
        //       attributeFilter: ['name'],
        //   });
  

      

    },


    // Borrowed from HasMany... need to implement
     /**
         * Remove the event handlers - the modal has closed, so we mustn't listen for events any longer
         * Any events received may have come from other fields.
         */
     clearHandlers: function() {
        // $(document).off('modal-link-response', self.appendItem );
        // $(document).off('modal-link-response', self.replaceItem );
    },

    setValue: function(data) { //value, text) {
        // $(this.element).find('.fileupload-value').val(value);

         // create a load of hidden text fields, holding the data items (allows for changes to the model?)
        let fldname = $(this.element).find('input.fileupload-value').attr('name');
        for(key in data) {
            // console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + fldname + '[' + key + ']" value="' + data[key] + '">');
        }
        
        $(this.element).addClass('has-file');
        $(this.element).removeClass('block-submit');

        // console.log('set value:' , data);

        // let img = $(this.element).find('img.preview');
        
        // img.on('load', function() {
            // $(this).css('opacity', 1);
        // });
        // img.css('opacity', 0.5).attr('src', '/image/max/' + data['hashed_filename']);
        
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

    start: function() {
        // alert('start');
        $(this.element).find('.fileupload-ui').trigger('click');
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
  childList: true,
  attributes: false,
  //...
});
