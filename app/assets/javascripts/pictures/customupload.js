function gPictureForm(){
  var picture_upload = {
		  picture: {
			remote_file_url: $('#picture_remote_file_url').val(),
			title: $('#picture_title').val(),
			description: $('#picture_description').val(),
			city_id: $('#picture_city_id').val(),
			user_attributes: {
				name: $('#picture_user_attributes_name').val(),
				locale: $('#picture_user_attributes_locale').val(),
				fbid: $('#picture_user_attributes_fbid').val()
			}
		  }
		};

		if( $('#picture_remote_file_url').val().indexOf('vimeo')!=-1 || $('#picture_remote_file_url').val().indexOf('youtube')!=-1  ){
				
			picture_upload['picture']['video_url'] = $('#picture_remote_file_url').val();
			picture_upload['picture']['remote_file_url'] = $('.thumb_paste img').attr('src');
		}
	return picture_upload;
}
function gVimeo(){
  var picture_upload = gPictureForm();
    var id = 0;
    var vimeo_meta = "";
    var url = $('#picture_remote_file_url').val();

	if (url.match(/(http)?(s\.)?:\/\/(www\.)?vimeo.com\/[0-9]+/)) {
	    id = url.split('/')[3];
	} else if (url.match(/^vimeo.com\/channels\/[\d\w]+#[0-9]+/)) {
	    id = url.split('#')[1];
	} else if (url.match(/vimeo.com\/groups\/[\d\w]+\/videos\/[0-9]+/)) {
	    id = url.split('/')[4];
	} else {
	    throw new Error('Unsupported Vimeo URL');
	}

     

    $.ajax({
	url: 'http://vimeo.com/api/v2/video/' + id + '.json',
	dataType: 'jsonp',
	success: function(data) {
	     var vimeo_medium = data[0].thumbnail_medium;
	     var vimeo_large = data[0].thumbnail_large;
	     $('.files .preview').html( '<div class="thumb_paste"><img src="'+vimeo_medium+'"/></div>');
		picture_upload['picture']['video_url'] = $('#picture_remote_file_url').val();
		picture_upload['picture']['remote_file_url'] = vimeo_large;
	}
    });
  return picture_upload;
}
function gYoutube(){
  var picture_upload = gPictureForm();
  var ytThumb = $.jYoutube( $('#picture_remote_file_url').val() );
  if( ytThumb !== null && $('#picture_remote_file_url').val().indexOf('youtube')!=-1 ) {
	picture_upload['picture']['video_url'] = $('#picture_remote_file_url').val();
	picture_upload['picture']['remote_file_url'] = ytThumb;
  }

  return picture_upload;
}
(function ($) {
    'use strict';

  $.widget('blueimpUIX.fileupload', $.blueimpUI.fileupload, {

      options: {
          errorMessages: {
              maxFileSize: 'File is too big',
              minFileSize: 'File is too small',
              acceptFileTypes: 'Filetype not allowed',
              maxNumberOfFiles: 'Max number of files exceeded'
          }
      },
      
      _initFileUploadButtonBar: function () {
          var fileUploadButtonBar = this.element.find('.fileupload-buttonbar'),
              filesList = this.element.find('.files'),
              ns = this.options.namespace,
	      fileUpload = this;

          this.element.find('.fileinput-button').each(function () {
              var fileInput = $(this).find('input:file');//.detach();
          });
          fileUploadButtonBar.find('.start')
              .bind('click.' + ns, function (e) {
		  if( filesList.find('.start button').length>0 && $('.thumb_paste').length==0 ){
			  e.preventDefault();
			  $('#picture_remote_file_url').val('');
			  filesList.find('.start button').click();
		  }else{
			  e.preventDefault();
			  var picture_upload = gPictureForm();
			  $.ajax(
			  {
				type: 'POST',
				url: '/pictures.json',
				data: picture_upload,
				success: function(r){
					$('#mosaic_copy').html('<h3 class="cufon-intel">Upload Complete!</h3>');
					Cufon.replace($('#mosaic_copy'));

					$('.files').html( '' );

					$('form#new_picture').fadeOut();
					$('.fileupload-buttonbar').fadeOut();


					    
					    var rDown = fileUpload._renderDownload([r])
						.css('display', 'none')
						.appendTo($(fileUpload.element).find('.files'))
						.fadeIn(function () {
						    // Fix for IE7 and lower:
						    $(this).show();
							$('.template-download .preview')
								.css('overflow','visible')
								.css('width',350);
							Cufon.replace($('.preview'));
							$('.fileupload-content')
								.css('marginLeft',15);
						});



				},
				error: function(r){
					console.log('ERROR');
					console.log(r);
				}
			  });

		  }

              });
          fileUploadButtonBar.find('.cancel')
              .button({icons: {primary: 'ui-icon-cancel'}})
              .bind('click.' + ns, function (e) {
                  e.preventDefault();
                  filesList.find('.cancel button').click();
              });
      },
      
      _deleteHandler: function (e) {
          e.preventDefault();
          var button = $(this);
          if ($(this).parent().hasClass("all")) {
            e.data.fileupload._trigger('destroy', e, {
                context: button.closest('.template-download'),
                url: button.attr('data-url'),
                type: button.attr('data-type'),
                dataType: e.data.fileupload.options.dataType
            });
          }
          else {
            if ( confirm("Are you sure you want to delete this file ?") == true) {
              e.data.fileupload._trigger('destroy', e, {
                  context: button.closest('.template-download'),
                  url: button.attr('data-url'),
                  type: button.attr('data-type'),
                  dataType: e.data.fileupload.options.dataType
              });
            }
            else {
              return false;
            }
          }
      },

      _renderUploadTemplate: function (files) {
          var that = this,
              rows = $();
          $.each(files, function (index, file) {
              file = that._uploadTemplateHelper(file);
              var row = $('<div class="template-upload">' + 
                  '<div class="preview"></div>' +

                  (file.error ?
                      '<div class="error"></div>'
                  :
                      '<div class="start"><button>Start</button></div>'
                  ) + 
                  '<div class="cancel"><button>Cancel</button></div>' +
                  '</div>');
              if (file.error) {
	      	  console.log( file.error );
                  row.addClass('ui-state-error');
                  row.find('.error').text(
                      that.options.errorMessages[file.error] || file.error
                  );
              }
              rows = rows.add(row);
          });
          return rows;
      }

  });
  
}(jQuery));
