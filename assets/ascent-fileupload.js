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
        placeholder: 'Choose file'
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
        // console.log($(obj).data());

        upl = $(this.element).find('input[type="file"]');


        // alert('init uplaoder');

        if($(this.element).find('.fileupload-value').val() != '') {
            $(this.element).addClass('has-file');
        }

        $(this.element).find('.fileupload-reset').on('click', function(e) {
            self.reset();
            e.stopPropagation();
        });
        
        $(upl).on('change', function() {

            var formData = new FormData(); 
            formData.append('payload', this.files[0]); 
            formData.append('disk', self.options.disk);
            formData.append('path', self.options.path);
            formData.append('preserveFilename', self.options.preserveFilename?1:0);

            $.ajax({
                xhr: function()
                {
                    
                  var xhr = new window.XMLHttpRequest();
                  
                  //self.setUploadState();
                  //Upload progress
                  xhr.upload.addEventListener("progress", function(evt){
                
                    if (evt.lengthComputable) {
                      var percentComplete = (evt.loaded / evt.total) * 100;
                      //Do something with upload progress
                      //prog.find('PROGRESS').attr('value', percentComplete);
                      self.updateUI('Uploading...', percentComplete);
                      console.log(percentComplete);

                    }
                  }, false);
                  return xhr;
                },cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                url: "/file-upload",
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
                
              }).done(function(data, xhr, requesr){

                    self.setValue(data);

                    $(self.element).trigger('change');
                  
              }).fail(function (data) {

                switch(data.status) {
                    case 403:
                        alert('You do not have permission to upload files');

                     //   self.updateUI('You do not have permission to upload files', 0, 'error');

                        break;

                    case 413:
                        alert('The file is too large for the server to accept');
                        //self.updateUI('The file is too large for the server to accept', 0, 'error');
                        break;

                    default:
                        alert('An unexpected error occurred');
                        //self.updateUI('An unexpected error occurred', 0, 'error');
                        break;
                }


                self.reset();

              });
          

        });
        
        $(obj).addClass('initialised');


    },

    setValue: function(data) { //value, text) {
        // $(this.element).find('.fileupload-value').val(value);

         // create a load of hidden text fields, holding the data items (allows for changes to the model?)
        for(key in data) {
            console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + $(this.element).data('fieldname') + '[' + key + ']" value="' + data[key] + '">');
        }
        
        $(this.element).addClass('has-file');
        this.updateUI(data.original_filename, 0);

    },

    reset: function() {
        
        $(this.element).find('.data-item').remove();
        
        $(this.element).removeClass('has-file');
        this.updateUI(this.options.placeholder, 0);

        console.log(this.element);

        $(this.element).trigger('change');
    },

    updateUI: function(text, pct=0) {

        var bar = $(this.element).find('.fileupload-progress');
        console.log(bar);
        console.log( (100 - pct) + '%');
        bar.css('right', (100 - pct) + '%');

        $(this.element).find('.fileupload-text').html(text);

    },

   

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


