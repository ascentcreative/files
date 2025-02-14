function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ******
// Croppie Image Uploader
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2023
$.ascent = $.ascent ? $.ascent : {};
var CroppieUpload = {
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
  _init: function _init() {
    var self = this;
    this.widget = this;
    idAry = this.element[0].id.split('-');
    var thisID = this.element[0].id;
    var fldName = idAry[1];
    var obj = this.element;
    $(obj).addClass('initialised');
    this.options.token = $(obj).data('token');
    this.options.configtoken = $(obj).data('configtoken');

    // alert(this.options.token);

    // when a file is selected, read the contents:
    $(this.element).find('.croppie-file').change(function () {
      self.readFile(this);
    });
    console.log('croppie upload value on init', $(this.element).data('value'));
    if (data = $(this.element).data('value')) {
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
  readFile: function readFile(input) {
    // alert('reading file');

    var self = this;
    if (input.files && input.files[0]) {
      console.log('reading input...');
      var reader = new FileReader();
      reader.onload = function (e) {
        img = new Image();
        img.onload = function () {
          self.startCroppie(e.target.result, img.width, img.height, input.files[0]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else {

      // alert("Sorry - your browser doesn't support the FileReader API");
    }
  },
  startCroppie: function startCroppie(url, filewidth, fileheight, file) {
    var self = this;

    //        let modal = $(this.element).find('.modal');
    $(this.element).find('.modal')
    // .one('click', '.btn-cancel', function() {
    //     $('.modal').modal('hide'); //.modal('dispose');
    //     return false;
    // })
    .one('shown.bs.modal', function () {
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
        enableExif: true
        // enableResize: (self.options.constrained ? false : true)
      });
      $(this).find('.croppie').croppie('bind', {
        url: url
      }).then(function () {
        console.log('jQuery bind complete');
      });
    }).one('hidden.bs.modal', function () {
      $('.croppie').croppie('destroy');
    }).modal({
      backdrop: 'static',
      keyboard: false
    });
    $(this.element).on('click', '.btn-ok', function (e) {
      // let self = this;
      e.preventDefault();

      // alert('oik');
      console.log($('.croppie').croppie('result'));
      $('.croppie').croppie('result', {
        type: 'blob',
        // size: {width: self.options.targetWidth, height: self.options.targetHeight},
        size: _defineProperty({
          width: 400
        }, "width", 400),
        format: 'jpeg',
        // format,
        quality: 1 //self.options.quality
      }).then(function (resp) {
        // console.log(file.name);
        // console.log(self);
        // alert(self.options.token);

        resp.name = file.name;
        self.uploader = new ChunkableUploader({
          'disk': 'files',
          //self.options.disk,
          'path': '',
          //self.options.path,
          'preserveFilename': 0,
          //self.options.preserveFilename?1:0,
          // 'chunkSize': null, //self.options.chunkSize,
          'token': self.options.token,
          'configtoken': self.options.configtoken
        });
        $(document).on("chunkupload-complete", function (e, data) {
          console.log(data);
          $(self.element).removeClass('file-uploading');
          if (data.chunkerId == self.uploader.chunkerId) {
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
  setValue: function setValue(data) {
    //value, text) {
    // $(this.element).find('.fileupload-value').val(value);
    $(this.element).find('.data-item').remove();

    // create a load of hidden text fields, holding the data items (allows for changes to the model?)
    var fldname = $(this.element).data('fieldname'); //find('input.fileupload-value').attr('name');
    for (key in data) {
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
  }
};
$.widget('ascent.croppieupload', CroppieUpload);
$.extend($.ascent.CroppieUpload, {});

// init on document ready
$(document).ready(function () {
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

// ******
// Single File Uploader
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2023
$.ascent = $.ascent ? $.ascent : {};
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
  _init: function _init() {
    var self = this;
    this.widget = this;
    idAry = this.element[0].id.split('-');
    var thisID = this.element[0].id;
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
    if (data = $(this.element).data('value')) {
      this.setValue(data);
    }
    $(this.element).find('.fileupload-reset').on('click', function (e) {
      $(self.element).find('input[type="file"]').val('');
      self.reset();
      e.stopPropagation();
    });
    $(upl).on('change', function () {
      console.log('fileupload - change');
      self.reset();
      if (self.options.allowedSize > 0 && this.files[0].size > self.options.allowedSize) {
        self.setError(this.files[0].name + ' is too big (' + self.formatBytes(this.files[0].size) + '). Max = ' + self.formatBytes(self.options.allowedSize));
        return;
      }
      self.uploader = new ChunkableUploader({
        'disk': self.options.disk,
        'path': self.options.path,
        'preserveFilename': self.options.preserveFilename ? 1 : 0,
        'chunkSize': self.options.chunkSize,
        'token': self.options.token,
        'configtoken': self.options.configtoken
      });
      $(document).on("chunkupload-progress", function (e, data) {
        $(self.element).addClass('file-uploading');
        if (data.chunkerId == self.uploader.chunkerId) {
          self.updateUI('Uploading: ' + data.filename, data.percentComplete);
          $(self.element).trigger('change');
        }
      });
      $(document).on("chunkupload-complete", function (e, data) {
        console.log(data);
        $(self.element).removeClass('file-uploading');
        if (data.chunkerId == self.uploader.chunkerId) {
          // console.log('comlpete found', e, data);
          self.setValue(data.filemodel);
          $(self.element).trigger('change');
          $(self.element).trigger({
            type: 'upload-complete',
            filedata: data.filemodel
          });
          // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
        }
      });
      $(self.element).trigger({
        type: 'upload-start'
      });
      $(document).on("chunkupload-error", function (e, data) {
        $(self.element).removeClass('file-uploading');
        if (data.chunkerId == self.uploader.chunkerId) {
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
  clearHandlers: function clearHandlers() {
    // $(document).off('modal-link-response', self.appendItem );
    // $(document).off('modal-link-response', self.replaceItem );
  },
  setValue: function setValue(data) {
    //value, text) {
    // $(this.element).find('.fileupload-value').val(value);

    // create a load of hidden text fields, holding the data items (allows for changes to the model?)
    var fldname = $(this.element).find('input.fileupload-value').attr('name');
    for (key in data) {
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
  reset: function reset() {
    $(this.element).find('.data-item').remove();
    $(this.element).removeClass('has-file');
    $(this.element).removeClass('error');
    $(this.element).removeClass('block-submit');
    this.updateUI(this.options.placeholder, 0);

    // console.log(this.element);

    $(this.element).trigger('change');
  },
  start: function start() {
    // alert('start');
    $(this.element).find('.fileupload-ui').trigger('click');
  },
  updateUI: function updateUI(text) {
    var pct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (pct != 0) {
      pct = Math.min(Math.round(pct), 100);
    }
    var bar = $(this.element).find('.fileupload-progress');
    bar.css('right', 100 - pct + '%');
    if (pct != 0) {
      if (pct == 100) {
        text = text + ' <strong>(Processing - please wait...)</strong>';
      } else {
        text = text + ' (' + pct + "%)";
      }
    }
    $(this.element).find('.fileupload-text').html(text);
  },
  setError: function setError(text) {
    $(this.element).addClass('error').find('.fileupload-text').html(text);
  },
  formatBytes: function formatBytes(bytes) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    for (var i = 1; i < sizes.length; i++) {
      if (bytes < Math.pow(1024, i)) return Math.round(bytes / Math.pow(1024, i - 1) * 100) / 100 + sizes[i - 1];
    }
    return bytes;
  }
};
$.widget('ascent.fileupload', FileUpload);
$.extend($.ascent.FileUpload, {});

// init on document ready
$(document).ready(function () {
  // alert('init blockselect');
  $('.fileupload').not('.initialised').fileupload();
});
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
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
  attributes: false
  //...
});

// ******
// Custom form component to enter & edit bible refs
// Expects incoming data from Laravel Eloquent
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2021

$.ascent = $.ascent ? $.ascent : {};
var FileUploadMulti = {
  uploader: null,
  options: {
    disk: 'files',
    path: '',
    preserveFilename: 1,
    placeholder: 'Choose file',
    sortable: false,
    chunkSize: null,
    allowedSize: 0,
    token: null,
    maxFiles: 0,
    configtoken: null
  },
  _init: function _init() {
    var self = this;
    this.widget = this;
    idAry = this.element[0].id.split('-');
    var thisID = this.element[0].id;
    var fldName = idAry[1];
    var obj = this.element;
    this.options.disk = $(obj).data('disk');
    this.options.path = $(obj).data('path');
    this.options.preserveFilename = $(obj).data('preservefilename');
    this.options.data = obj.data('value');
    this.options.chunkSize = $(obj).data('chunksize');
    this.options.allowedSize = $(obj).data('allowedsize');
    this.options.token = $(obj).data('token');
    this.options.maxFiles = $(obj).data('maxfiles');
    this.options.configtoken = $(obj).data('configtoken');
    if (this.options.data) {
      for (file in this.options.data) {
        this.createFileBlock(this.options.data[file]);
      }
      this.updateFileIndexes();
    }

    // check against specified max files:
    $(this.element).parents('.fileupload-outer').on('click', "label.button", function () {
      var max = self.options.maxFiles;
      if (max != 0) {
        var count = $(self.element).find('.fileuploadmulti-ui').length;
        if (count >= max) {
          alert("You may only add " + max + " file" + (max > 1 ? "s" : ""));
          return false;
        }
      }
    });
    var uploader = $(this.element).find('input[type="file"]');

    // console.log(upl);

    // console.log($(this.element).find('.fileupload-value').val());
    this.checkFiles();
    uploader.on('change', function () {
      // check we've not spammed a massive selection
      var max = self.options.maxFiles;
      var count = $(self.element).find('.fileuploadmulti-ui').length + this.files.length;
      if (max != 0 && count > max) {
        alert("You may only add " + max + " file" + (max > 1 ? "s" : ""));
        return false;
      }

      // alert('oikj');
      // console.log(self.element);
      // for each file selected, create a new uploader bar and show progress as it uploads.

      for (var iFile = 0; iFile < this.files.length; iFile++) {
        $(self.element).css('border', '3px solid red !important');
        var item = self.createFileBlock();
        $(item).fileuploadmultifile('upload', this.files[iFile]);
      }
    });
    if (this.options.sortable) {
      $(this.element).sortable({
        update: function update(event, ui) {
          self.updateFileIndexes();
          ui.item.find('input').change();
        }
      });
    }
    $(this.element).on('change', function () {
      self.checkFiles();
      self.updateFileIndexes();
    });
    $(this.element).addClass('initialised');
  },
  clear: function clear() {
    $(this.element).find('.fileuploadmulti-ui').remove();
    this.checkFiles();
  },
  checkFiles: function checkFiles(data) {
    var len = $(this.element).find('.fileuploadmulti-ui').length;
    if (len > 0) {
      $(this.element).addClass('has-file');
    } else {
      $(this.element).removeClass('has-file');
    }
  },
  createFileBlock: function createFileBlock(data) {
    template = $('template#fileuploadmulti-item');
    var item = $(template.html());
    $(this.element).append(item);
    $(item).fileuploadmultifile({
      disk: this.options.disk,
      path: this.options.path,
      preserveFilename: this.options.preserveFilename,
      fieldname: this.element.attr('name'),
      chunkSize: this.options.chunkSize,
      allowedSize: this.options.allowedSize,
      token: this.options.token,
      configtoken: this.options.configtoken
    });
    if (data) {
      // console.log('setting data');
      // console.log(data);
      $(item).fileuploadmultifile('setValue', data); //, data.id , data.original_name);
    }
    return item;
  },
  updateFileIndexes: function updateFileIndexes() {
    fldname = this.element.attr('name');
    $(this.element).find('.fileuploadmulti-ui').each(function (index) {
      var prefix = fldname + "[" + index + "]";
      // console.log('prefix: ' + prefix);
      // console.log($(this).find("input"));
      $(this).find("input").each(function () {
        // console.log(this.name);
        esc = fldname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        re = new RegExp(esc + "\\[\\d+\\]");
        this.name = this.name.replace(re, prefix);
      });
    });
  }
};
$.widget('ascent.fileuploadmulti', FileUploadMulti);
$.extend($.ascent.FileUploadMulti, {});
var FileUploadMultiFile = {
  options: {
    disk: 'public',
    path: 'fileuploads',
    preserveFilename: false,
    fieldname: '',
    chunkSize: null,
    allowedSize: 0,
    token: null,
    configtoken: null
  },
  _init: function _init() {
    // console.log("INIT FILE");
    // console.log('this', this.element);
    var self = this;
    $(this.element).find('.fileupload-reset').on('click', function () {
      var parent = $(self.element).parents('.fileuploadmulti');
      $(self.element).remove();
      // fire a change event
      // alert(self.options.fieldname);
      $(parent).trigger('change');
    });
  },
  setValue: function setValue(data) {
    //value, text) {

    // console.log(data);
    //$(this.element).find('.fileuploadmulti-id').val(value);
    //$(this.element).find('.fileuploadmulti-label').val(text);

    // create a load of hidden text fields, holding the data items (allows for changes to the model?)
    for (key in data) {
      // console.log(key);
      $(this.element).prepend('<input type="hidden" class="data-item" name="' + this.options.fieldname + '[9999][' + key + ']" value="' + data[key] + '">');
      if (key == 'label') {
        $(this.element).find('.fileupload-label INPUT').val(data[key]);
      }
    }
    $(this.element).removeClass('uploading').addClass('has-file');
    this.updateUI(data.original_filename, 0);

    // fire a change event
    $(this.element).find('.fileuploadmulti-label').change();
  },
  updateUI: function updateUI(text) {
    var pct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (pct != 0) {
      pct = Math.min(Math.round(pct), 100);
    }
    var bar = $(this.element).find('.fileupload-progress');
    // console.log(bar);
    // console.log( (100 - pct) + '%');
    bar.css('right', 100 - pct + '%');
    if (pct != 0) {
      if (pct == 100) {
        text = text + ' <strong>(Processing - please wait...)</strong>';
      } else {
        text = text + ' (' + pct + "%)";
      }
    }
    $(this.element).find('.fileupload-text .fileupload-filename').html(text);
  },
  setError: function setError(text) {
    $(this.element).addClass('error').find('.fileupload-text').html(text);
  },
  upload: function upload(file) {
    var self = this;
    $(self.element).addClass('uploading');

    // console.log(self.options);

    if (self.options.allowedSize > 0 && file.size > self.options.allowedSize) {
      self.setError(file.name + ' is too big (' + self.formatBytes(file.size) + '). Max = ' + self.formatBytes(self.options.allowedSize));
      return;
    }
    this.uploader = new ChunkableUploader({
      'disk': self.options.disk,
      'path': self.options.path,
      'preserveFilename': self.options.preserveFilename ? 1 : 0,
      'chunkSize': self.options.chunkSize,
      'token': self.options.token,
      'configtoken': self.options.configtoken
    });
    $(document).on("chunkupload-progress", function (e, data) {
      // console.log(data.chunkerId + ' - ' + self.uploader.chunkerId);

      if (data.chunkerId == self.uploader.chunkerId) {
        // console.log('progress found', e, data);
        self.updateUI('Uploading: ' + data.filename, data.percentComplete);
        $(self.element).trigger('change');
      }
    });
    $(document).on("chunkupload-complete", function (e, data) {
      if (data.chunkerId == self.uploader.chunkerId) {
        // console.log('comlpete found', e, data);
        self.setValue(data.filemodel);
        $(self.element).trigger('change');
        // self.updateUI('Uploading: ' + Math.round(data.percentComplete) + "%", data.percentComplete);
      }
    });
    $(document).on("chunkupload-error", function (e, data) {
      if (data.chunkerId == self.uploader.chunkerId) {
        self.setError(data.message);
      }
    });
    this.uploader.upload(file);
  },
  formatBytes: function formatBytes(bytes) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    for (var i = 1; i < sizes.length; i++) {
      if (bytes < Math.pow(1024, i)) return Math.round(bytes / Math.pow(1024, i - 1) * 100) / 100 + sizes[i - 1];
    }
    return bytes;
  }
};
$.widget('ascent.fileuploadmultifile', FileUploadMultiFile);
$.extend($.ascent.FileUploadMultiFile, {});
$(document).ready(function () {
  $('.fileuploadmulti').not('.initialised').fileuploadmulti();
});
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function (mutations, observer) {
  // fired when a mutation occurs
  // console.log(mutations, observer);
  // ...
  $('.fileuploadmulti').not('.initialised').fileuploadmulti();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  childList: true
  //...
});

// ******
// Custom form component to enter & edit bible refs
// Expects incoming data from Laravel Eloquent
// ******
// Code (c) Kieran Metcalfe / Ascent Creative 2021

// alert('ok');
$.ascent = $.ascent ? $.ascent : {};
var GalleryUpload = {
  options: {
    disk: 'files',
    path: '',
    preserveFilename: 0,
    placeholder: 'Choose file',
    sortable: true,
    maxFiles: 0
  },
  _init: function _init() {
    // console.log('init');

    var self = this;
    this.widget = this;
    idAry = this.element[0].id.split('-');
    var thisID = this.element[0].id;
    var fldName = idAry[1];
    var obj = this.element;
    this.options.maxFiles = $(this.element).data('maxfiles');

    // console.log(obj.data('value'));

    for (file in obj.data('value')) {
      this.createFileBlock(obj.data('value')[file]);
    }
    upl = $(this.element).find('input[type="file"]');

    // console.log('upl', upl);

    if ($(this.element).find('.galleryupload-value').val() != '') {
      $(this.element).addClass('has-file');
    }
    $(this.element).on('click', 'label.button', function () {
      var max = self.options.maxFiles;
      if (max != 0) {
        var count = $(self.element).find('.galleryupload-ui').length;
        if (count >= max) {
          alert("You may only add " + max + " image" + (max > 1 ? "s" : ""));
          return false;
        }
      }
    });
    upl.on('change', function () {
      // for each file selected, create a new uploader bar and show progress as it uploads.

      // check we've not just spammed with a massive selection:
      var max = self.options.maxFiles;
      var count = $(self.element).find('.galleryupload-ui').length + this.files.length;
      if (max != 0 && count > max) {
        alert("You may only add " + max + " image" + (max > 1 ? "s" : ""));
        return false;
      }
      for (var iFile = 0; iFile < this.files.length; iFile++) {
        var item = self.createFileBlock();
        $(item).galleryuploaditem('upload', this.files[iFile]);
      }
      $(this).val('');
    });
    if (this.options.sortable) {
      $(this.element).find('.galleryupload-items').sortable({
        update: function update(event, ui) {
          self.updateFileIndexes();
          ui.item.find('input').change();
        }
      });
    }
    $(this.element).on('click', '.galleryupload-remove', function () {
      $(this).parents('.galleryupload-item').remove();
      self.updateFileIndexes();
    });
    $(this.element).on('change', function () {
      // console.log('change handler');
      self.updateFileIndexes();
    });
  },
  createFileBlock: function createFileBlock(data) {
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
      fieldname: this.element.attr('name')
    });
    if (data) {
      // console.log('setting data');
      // console.log(data);
      $(item).galleryuploaditem('setValue', data); //.id , data.original_filename);
    }
    this.updateFileIndexes();
    return item;
  },
  updateFileIndexes: function updateFileIndexes() {
    fldname = this.element.attr('name');
    console.log('fldname:' + fldname);
    $(this.element).find('.galleryupload-ui').each(function (index) {
      var prefix = fldname + "[" + index + "]";
      console.log(prefix);
      console.log($(this.element).find("input"));
      $(this).find("input").each(function () {
        console.log(this.name);
        esc = fldname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        re = new RegExp(esc + "\\[\\d+\\]");
        this.name = this.name.replace(re, prefix);
      });
    });
  }
};
$.widget('ascent.galleryupload', GalleryUpload);
$.extend($.ascent.GaleryUpload, {});
var GalleryUploadItem = {
  options: {
    disk: 'public',
    path: 'galleryuploads',
    preserveFilename: false,
    fieldname: ''
  },
  _init: function _init() {
    // console.log("INIT FILE");
    // console.log('this', this.element);
    var self = this;
  },
  setValue: function setValue(data) {
    //}, text) {

    // console.log('setting value');
    // console.log(value); //, text);
    // console.log($(this.element).find('.galleryupload-image'));
    // $(this.element).find('.galleryupload-id').val(value.id);
    // $(this.element).find('.galleryupload-original_filename').val(value.original_filename);
    // $(this.element).find('.galleryupload-hashed_filename').val(value.hashed_filename);

    // create a load of hidden text fields, holding the data items (allows for changes to the model?)
    for (key in data) {
      // console.log(key);
      $(this.element).append('<input type="hidden" class="data-item" name="' + this.options.fieldname + '[9999][' + key + ']" value="' + data[key] + '">');
    }
    $(this.element).find('.galleryupload-image').css('background-image', "url('/image/preview/" + data.hashed_filename + "')");
    $(this.element).addClass('has-file');
    this.updateUI(data.original_filename, 0);

    // fire a change event
    $(this.element).find('.galleryupload-label').change();
  },
  updateUI: function updateUI(text) {
    var pct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var bar = $(this.element).find('.galleryupload-progress');
    // console.log(bar);
    // console.log( (100 - pct) + '%');
    bar.css('right', 100 - pct + '%');
    $(this.element).find('.galleryupload-text').html(text);
  },
  upload: function upload(file) {
    var self = this;
    var formData = new FormData();
    formData.append('payload', file);
    formData.append('disk', self.options.disk);
    formData.append('path', self.options.path);
    formData.append('preserveFilename', self.options.preserveFilename);
    $.ajax({
      xhr: function xhr() {
        var xhr = new window.XMLHttpRequest();

        //self.setUploadState();
        //Upload progress
        xhr.upload.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total * 100;
            //Do something with upload progress
            //prog.find('PROGRESS').attr('value', percentComplete);
            self.updateUI('Uploading...', percentComplete);
            // console.log(percentComplete);
          }
        }, false);
        return xhr;
      },
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      url: "/file-upload",
      data: formData
    }).done(function (data, xhr, request) {
      //Do something success-ish
      self.setValue(data); //.id, data.original_name);

      // console.log(data);

      $(self.element).trigger('change');
    }).fail(function (data) {
      switch (data.status) {
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
    });
  }
};
$.widget('ascent.galleryuploaditem', GalleryUploadItem);
$.extend($.ascent.GalleryUploadItem, {});
var ChunkableUploader = /*#__PURE__*/function () {
  function ChunkableUploader(data) {
    _classCallCheck(this, ChunkableUploader);
    _defineProperty(this, "chunkSize", 60000000);
    _defineProperty(this, "chunkerId", void 0);
    this.chunkerId = String(Date.now()) + Math.floor(Math.random() * 10000);
    for (var item in data) {
      this[item] = data[item];
    }
  }
  return _createClass(ChunkableUploader, [{
    key: "upload",
    value: function upload(file) {
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
  }, {
    key: "uploadChunk",
    value: function uploadChunk() {
      var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      if (idx > this.chunkCount) {
        throw new Error('Chunk ' + idx + ' out of bounds');
        return;
      }
      var uploader = this;
      var chunk = this.makeChunk(idx);

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
        xhr: function xhr() {
          var xhr = new window.XMLHttpRequest();
          xhr.upload.addEventListener("error", function (evt) {
            console.log('Upload Error', evt);
            $(document).trigger('chunkupload-error', {
              chunkerId: uploader.chunkerId,
              message: "An error occurred during upload."
            });
          });

          //Upload progress
          xhr.upload.addEventListener("progress", function (evt) {
            // calc overall percentage:
            var prevChunks = uploader.chunkSize * (idx - 1);
            var loaded = prevChunks + evt.loaded;

            // throw a new event
            $(document).trigger('chunkupload-progress', {
              chunkerId: uploader.chunkerId,
              percentComplete: loaded / uploader.file.size * 100,
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
          'X-UPLOAD-TOKEN': uploader.token,
          'X-UPLOAD-CONFIG': uploader.configtoken
        }
      }).done(function (data, xhr, request) {
        if (parseInt(data.chunkIdx) < uploader.chunkCount) {
          uploader.uploadChunk(parseInt(data.chunkIdx) + 1);
        } else {
          $(document).trigger('chunkupload-complete', {
            chunkerId: uploader.chunkerId,
            filemodel: data
          });
        }
      }).fail(function (data) {
        var message = data.responseJSON.message;
        if (message == '') {
          switch (data.status) {
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
        }
        $(document).trigger('chunkupload-error', {
          chunkerId: uploader.chunkerId,
          data: data,
          status: data.status,
          message: message
        });
      });
    }
  }, {
    key: "makeChunk",
    value: function makeChunk(idx) {
      var chunkStart = this.chunkSize * (idx - 1);
      var chunkEnd = Math.min(chunkStart + this.chunkSize, this.file.size);
      var chunk = this.file.slice(chunkStart, chunkEnd);
      return chunk;
    }
  }]);
}();
/*!
 * Lightbox v2.11.4
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */
!function (a, b) {
  "function" == typeof define && define.amd ? define(["jquery"], b) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? module.exports = b(require("jquery")) : a.lightbox = b(a.jQuery);
}(this, function (a) {
  function b(b) {
    this.album = [], this.currentImageIndex = void 0, this.init(), this.options = a.extend({}, this.constructor.defaults), this.option(b);
  }
  return b.defaults = {
    albumLabel: "Image %1 of %2",
    alwaysShowNavOnTouchDevices: !1,
    fadeDuration: 600,
    fitImagesInViewport: !0,
    imageFadeDuration: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: !0,
    wrapAround: !1,
    disableScrolling: !1,
    sanitizeTitle: !1
  }, b.prototype.option = function (b) {
    a.extend(this.options, b);
  }, b.prototype.imageCountLabel = function (a, b) {
    return this.options.albumLabel.replace(/%1/g, a).replace(/%2/g, b);
  }, b.prototype.init = function () {
    var b = this;
    a(document).ready(function () {
      b.enable(), b.build();
    });
  }, b.prototype.enable = function () {
    var b = this;
    a("body").on("click", "a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]", function (c) {
      return b.start(a(c.currentTarget)), !1;
    });
  }, b.prototype.build = function () {
    if (!(a("#lightbox").length > 0)) {
      var b = this;
      a('<div id="lightboxOverlay" tabindex="-1" class="lightboxOverlay"></div><div id="lightbox" tabindex="-1" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/><div class="lb-nav"><a class="lb-prev" role="button" tabindex="0" aria-label="Previous image" href="" ></a><a class="lb-next" role="button" tabindex="0" aria-label="Next image" href="" ></a></div><div class="lb-loader"><a class="lb-cancel" role="button" tabindex="0"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close" role="button" tabindex="0"></a></div></div></div></div>').appendTo(a("body")), this.$lightbox = a("#lightbox"), this.$overlay = a("#lightboxOverlay"), this.$outerContainer = this.$lightbox.find(".lb-outerContainer"), this.$container = this.$lightbox.find(".lb-container"), this.$image = this.$lightbox.find(".lb-image"), this.$nav = this.$lightbox.find(".lb-nav"), this.containerPadding = {
        top: parseInt(this.$container.css("padding-top"), 10),
        right: parseInt(this.$container.css("padding-right"), 10),
        bottom: parseInt(this.$container.css("padding-bottom"), 10),
        left: parseInt(this.$container.css("padding-left"), 10)
      }, this.imageBorderWidth = {
        top: parseInt(this.$image.css("border-top-width"), 10),
        right: parseInt(this.$image.css("border-right-width"), 10),
        bottom: parseInt(this.$image.css("border-bottom-width"), 10),
        left: parseInt(this.$image.css("border-left-width"), 10)
      }, this.$overlay.hide().on("click", function () {
        return b.end(), !1;
      }), this.$lightbox.hide().on("click", function (c) {
        "lightbox" === a(c.target).attr("id") && b.end();
      }), this.$outerContainer.on("click", function (c) {
        return "lightbox" === a(c.target).attr("id") && b.end(), !1;
      }), this.$lightbox.find(".lb-prev").on("click", function () {
        return 0 === b.currentImageIndex ? b.changeImage(b.album.length - 1) : b.changeImage(b.currentImageIndex - 1), !1;
      }), this.$lightbox.find(".lb-next").on("click", function () {
        return b.currentImageIndex === b.album.length - 1 ? b.changeImage(0) : b.changeImage(b.currentImageIndex + 1), !1;
      }), this.$nav.on("mousedown", function (a) {
        3 === a.which && (b.$nav.css("pointer-events", "none"), b.$lightbox.one("contextmenu", function () {
          setTimeout(function () {
            this.$nav.css("pointer-events", "auto");
          }.bind(b), 0);
        }));
      }), this.$lightbox.find(".lb-loader, .lb-close").on("click keyup", function (a) {
        if ("click" === a.type || "keyup" === a.type && (13 === a.which || 32 === a.which)) return b.end(), !1;
      });
    }
  }, b.prototype.start = function (b) {
    function c(a) {
      d.album.push({
        alt: a.attr("data-alt"),
        link: a.attr("href"),
        title: a.attr("data-title") || a.attr("title")
      });
    }
    var d = this,
      e = a(window);
    e.on("resize", a.proxy(this.sizeOverlay, this)), this.sizeOverlay(), this.album = [];
    var f,
      g = 0,
      h = b.attr("data-lightbox");
    if (h) {
      f = a(b.prop("tagName") + '[data-lightbox="' + h + '"]');
      for (var i = 0; i < f.length; i = ++i) c(a(f[i])), f[i] === b[0] && (g = i);
    } else if ("lightbox" === b.attr("rel")) c(b);else {
      f = a(b.prop("tagName") + '[rel="' + b.attr("rel") + '"]');
      for (var j = 0; j < f.length; j = ++j) c(a(f[j])), f[j] === b[0] && (g = j);
    }
    var k = e.scrollTop() + this.options.positionFromTop,
      l = e.scrollLeft();
    this.$lightbox.css({
      top: k + "px",
      left: l + "px"
    }).fadeIn(this.options.fadeDuration), this.options.disableScrolling && a("body").addClass("lb-disable-scrolling"), this.changeImage(g);
  }, b.prototype.changeImage = function (b) {
    var c = this,
      d = this.album[b].link,
      e = d.split(".").slice(-1)[0],
      f = this.$lightbox.find(".lb-image");
    this.disableKeyboardNav(), this.$overlay.fadeIn(this.options.fadeDuration), a(".lb-loader").fadeIn("slow"), this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption").hide(), this.$outerContainer.addClass("animating");
    var g = new Image();
    g.onload = function () {
      var h, i, j, k, l, m;
      f.attr({
        alt: c.album[b].alt,
        src: d
      }), a(g), f.width(g.width), f.height(g.height);
      var n = g.width / g.height;
      m = a(window).width(), l = a(window).height(), k = m - c.containerPadding.left - c.containerPadding.right - c.imageBorderWidth.left - c.imageBorderWidth.right - 20, j = l - c.containerPadding.top - c.containerPadding.bottom - c.imageBorderWidth.top - c.imageBorderWidth.bottom - c.options.positionFromTop - 70, "svg" === e ? (n >= 1 ? (i = k, h = parseInt(k / n, 10)) : (i = parseInt(j / n, 10), h = j), f.width(i), f.height(h)) : (c.options.fitImagesInViewport ? (c.options.maxWidth && c.options.maxWidth < k && (k = c.options.maxWidth), c.options.maxHeight && c.options.maxHeight < j && (j = c.options.maxHeight)) : (k = c.options.maxWidth || g.width || k, j = c.options.maxHeight || g.height || j), (g.width > k || g.height > j) && (g.width / k > g.height / j ? (i = k, h = parseInt(g.height / (g.width / i), 10), f.width(i), f.height(h)) : (h = j, i = parseInt(g.width / (g.height / h), 10), f.width(i), f.height(h)))), c.sizeContainer(f.width(), f.height());
    }, g.src = this.album[b].link, this.currentImageIndex = b;
  }, b.prototype.sizeOverlay = function () {
    var b = this;
    setTimeout(function () {
      b.$overlay.width(a(document).width()).height(a(document).height());
    }, 0);
  }, b.prototype.sizeContainer = function (a, b) {
    function c() {
      d.$lightbox.find(".lb-dataContainer").width(g), d.$lightbox.find(".lb-prevLink").height(h), d.$lightbox.find(".lb-nextLink").height(h), d.$overlay.trigger("focus"), d.showImage();
    }
    var d = this,
      e = this.$outerContainer.outerWidth(),
      f = this.$outerContainer.outerHeight(),
      g = a + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right,
      h = b + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;
    e !== g || f !== h ? this.$outerContainer.animate({
      width: g,
      height: h
    }, this.options.resizeDuration, "swing", function () {
      c();
    }) : c();
  }, b.prototype.showImage = function () {
    this.$lightbox.find(".lb-loader").stop(!0).hide(), this.$lightbox.find(".lb-image").fadeIn(this.options.imageFadeDuration), this.updateNav(), this.updateDetails(), this.preloadNeighboringImages(), this.enableKeyboardNav();
  }, b.prototype.updateNav = function () {
    var a = !1;
    try {
      document.createEvent("TouchEvent"), a = !!this.options.alwaysShowNavOnTouchDevices;
    } catch (a) {}
    this.$lightbox.find(".lb-nav").show(), this.album.length > 1 && (this.options.wrapAround ? (a && this.$lightbox.find(".lb-prev, .lb-next").css("opacity", "1"), this.$lightbox.find(".lb-prev, .lb-next").show()) : (this.currentImageIndex > 0 && (this.$lightbox.find(".lb-prev").show(), a && this.$lightbox.find(".lb-prev").css("opacity", "1")), this.currentImageIndex < this.album.length - 1 && (this.$lightbox.find(".lb-next").show(), a && this.$lightbox.find(".lb-next").css("opacity", "1"))));
  }, b.prototype.updateDetails = function () {
    var a = this;
    if (void 0 !== this.album[this.currentImageIndex].title && "" !== this.album[this.currentImageIndex].title) {
      var b = this.$lightbox.find(".lb-caption");
      this.options.sanitizeTitle ? b.text(this.album[this.currentImageIndex].title) : b.html(this.album[this.currentImageIndex].title), b.fadeIn("fast");
    }
    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var c = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox.find(".lb-number").text(c).fadeIn("fast");
    } else this.$lightbox.find(".lb-number").hide();
    this.$outerContainer.removeClass("animating"), this.$lightbox.find(".lb-dataContainer").fadeIn(this.options.resizeDuration, function () {
      return a.sizeOverlay();
    });
  }, b.prototype.preloadNeighboringImages = function () {
    if (this.album.length > this.currentImageIndex + 1) {
      new Image().src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      new Image().src = this.album[this.currentImageIndex - 1].link;
    }
  }, b.prototype.enableKeyboardNav = function () {
    this.$lightbox.on("keyup.keyboard", a.proxy(this.keyboardAction, this)), this.$overlay.on("keyup.keyboard", a.proxy(this.keyboardAction, this));
  }, b.prototype.disableKeyboardNav = function () {
    this.$lightbox.off(".keyboard"), this.$overlay.off(".keyboard");
  }, b.prototype.keyboardAction = function (a) {
    var b = a.keyCode;
    27 === b ? (a.stopPropagation(), this.end()) : 37 === b ? 0 !== this.currentImageIndex ? this.changeImage(this.currentImageIndex - 1) : this.options.wrapAround && this.album.length > 1 && this.changeImage(this.album.length - 1) : 39 === b && (this.currentImageIndex !== this.album.length - 1 ? this.changeImage(this.currentImageIndex + 1) : this.options.wrapAround && this.album.length > 1 && this.changeImage(0));
  }, b.prototype.end = function () {
    this.disableKeyboardNav(), a(window).off("resize", this.sizeOverlay), this.$lightbox.fadeOut(this.options.fadeDuration), this.$overlay.fadeOut(this.options.fadeDuration), this.options.disableScrolling && a("body").removeClass("lb-disable-scrolling");
  }, new b();
});
