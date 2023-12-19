// ******
// Croppie Image Uploader
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2023
$.ascent = $.ascent?$.ascent:{};

var CroppieUpload = {

    uploader: null,
        
    options: {
        disk: 'files',
        path: '',
        preserveFilename: false,
        placeholder: 'Choose file',
        chunkSize: null,
        allowedSize: 0,
        token: null
    },
    
    _init: function () {
        
        var self = this;
        this.widget = this;
        
        idAry = (this.element)[0].id.split('-');
        
        var thisID = (this.element)[0].id;
        
        var fldName = idAry[1];
        
        var obj = this.element;

        $(obj).addClass('initialised');

        this.options.token = $(obj).data('token');

        // alert(this.options.token);

         // when a file is selected, read the contents:
        $(this.element).find('.croppie-file').change(function() { 
			self.readFile(this);
        });

        console.log('croppie upload value on init', $(this.element).data('value'));
        if(data = $(this.element).data('value')) {
            this.setValue(data);
        }


        // console.log( $(this.element).find('.croppie'));
        // $(this.element).find('.croppie').croppie({

        //     viewport: {
        //         width: 250,
        //         height: 250
        //         // width: this.vpw,
        //         // height: this.vph
        //     },
        //     boundary: {
        //         width: 280,
        //         height: 280
        //         // width: this.vpw + 0,
        //         // height: this.vph + 0
        //     },
        //     enableExif: true,
        //     // enableResize: (self.options.constrained ? false : true)

        // });

        // this.startCroppie();
    
    },


    readFile: function (input) {

        // alert('reading file');
			
        var self = this;
        
        if (input.files && input.files[0]) {
             
            console.log('reading input...');
             
            var reader = new FileReader();
            
            reader.onload = function (e) {
                
                img = new Image;
                img.onload = function() {
                    self.startCroppie(e.target.result, img.width, img.height, input.files[0].type);
                };
                img.src = e.target.result;
                                
            }
            
            reader.readAsDataURL(input.files[0]);

        } else {
            
            // alert("Sorry - your browser doesn't support the FileReader API");
            
        }

    },


    startCroppie: function(url, filewidth, fileheigth, filetype) {

        let self = this;

//        let modal = $(this.element).find('.modal');
        $(this.element).find('.modal')
            // .one('click', '.btn-cancel', function() {
            //     $('.modal').modal('hide'); //.modal('dispose');
            //     return false;
            // })
            .one('shown.bs.modal', function() {
              
                $(this).find('.croppie').croppie({

                    viewport: {
                        width: 250,
                        height: 250
                        // width: this.vpw,
                        // height: this.vph
                    },
                    boundary: {
                        width: 280,
                        height: 280
                        // width: this.vpw + 0,
                        // height: this.vph + 0
                    },
                    enableExif: true,
                    // enableResize: (self.options.constrained ? false : true)
        
                });

                $(this).find('.croppie').croppie('bind', {
                    url: url
                }).then(function(){
                    console.log('jQuery bind complete');
                });

            })  
            .one('hidden.bs.modal', function() {
                $('.croppie').croppie('destroy');
            })      
            .modal({
                backdrop: 'static',
                keyboard: false
            });

        $(this.element).on('click', '.btn-ok', function(e) {

            // let self = this;
            e.preventDefault();

            // alert('oik');
            console.log($('.croppie').croppie('result'));

            $('.croppie').croppie('result', {
                
                type: 'blob',
                // size: {width: self.options.targetWidth, height: self.options.targetHeight},
                size: {width: 400, width: 400},
                format: 'jpeg', // format,
                quality: 1, //self.options.quality
                
            }).then(function (resp) {
                // console.log(resp);
                // console.log(self);
                // alert(self.options.token);

                resp.name="mugshot.jpg";

                self.uploader = new ChunkableUploader({
                    'disk': 'files', //self.options.disk,
                    'path': '', //self.options.path,
                    'preserveFilename': 0, //self.options.preserveFilename?1:0,
                    // 'chunkSize': null, //self.options.chunkSize,
                    'token': self.options.token,
                });

                $(document).on("chunkupload-complete", function(e, data) {

                    console.log(data);
                    $(self.element).removeClass('file-uploading');
    
                    if(data.chunkerId == self.uploader.chunkerId) {
                        // console.log('comlpete found', e, data);
                        $('.modal').modal('hide');
                        self.setValue(data.filemodel);
                        $(self.element).trigger("croppie-upload-complete");
                        // $(self.element).trigger('change');
                        // $(self.element).trigger({
                        //         type: 'upload-complete',
                        //         filedata: data.filemodel,
                        // });
                        // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
                    }
    
                });

                self.uploader.upload(resp);

            });

        });

    },

    setValue: function(data) { //value, text) {
        // $(this.element).find('.fileupload-value').val(value);
        $(this.element).find('.data-item').remove();

         // create a load of hidden text fields, holding the data items (allows for changes to the model?)
        let fldname = $(this.element).data('fieldname'); //find('input.fileupload-value').attr('name');
        for(key in data) {
            // console.log(key);
            $(this.element).append('<input type="hidden" class="data-item" name="' + fldname + '[' + key + ']" value="' + data[key] + '">');
        }
        
        $(this.element).addClass('has-file');
        $(this.element).removeClass('block-submit');

        $(this.element).find('img.img-preview').attr('src', '/image/max/' + data['hashed_filename']);

        // console.log('set value:' , data);

        // let img = $(this.element).find('img.preview');
        
        // img.on('load', function() {
            // $(this).css('opacity', 1);
        // });
        // img.css('opacity', 0.5).attr('src', '/image/max/' + data['hashed_filename']);
        
        // this.updateUI(data.original_filename, 0);

    },


}

$.widget('ascent.croppieupload', CroppieUpload);
$.extend($.ascent.CroppieUpload, {
		 
		
}); 



// init on document ready
$(document).ready(function(){
    // alert('init blockselect');
    $('.croppie-upload').not('.initialised').croppieupload();
});


// MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// var observer = new MutationObserver(function(mutations, observer) {
//     // fired when a mutation occurs
//     // console.log(mutations, observer);
//     // ...
//     $('.fileupload').not('.initialised').fileupload();
// });

// // define what element should be observed by the observer
// // and what types of mutations trigger the callback
// observer.observe(document, {
//   subtree: true,
//   childList: true,
//   attributes: false,
//   //...
// });
