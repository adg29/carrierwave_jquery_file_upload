function gYoutube(){
  var picture_upload = {
		  picture: {
			remote_file_url: $('#picture_remote_file_url').val(),
			title: $('#picture_title').val(),
			description: $('#picture_description').val(),
			city_id: $('#picture_city_id').val(),
			user_attributes: {
				name: $('#picture_user_attributes_name').val(),
				locale: $('#picture_user_attributes_locale').val(),
				fbid: $('#picture_user_attributes_fbid').val(),
			}
		  }
		};
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
              .button({icons: {primary: 'ui-icon-circle-arrow-e'}})
              .bind('click.' + ns, function (e) {
		  if( filesList.find('.start button').length>0 && $('.thumb_paste').length==0 ){
			  e.preventDefault();
			  $('#picture_remote_file_url').val('');
			  filesList.find('.start button').click();
		  }else{
			  e.preventDefault();
			  var picture_upload = gYoutube();
			  $.ajax(
			  {
				type: 'POST',
				url: '/pictures.json',
				data: picture_upload,
				success: function(r){
					console.log('SUCCESSU');
					console.log(r);

					$('#mosaic_copy').html('<h2>Upload Complete!</h2>');

					$('.files').html( '' );

					$('form#new_picture').fadeOut();
					$('.fileupload-buttonbar').fadeOut();


					    
					    console.log('FU');
					    console.log( fileUpload );
					    var rDown = fileUpload._renderDownload([r])
						.css('display', 'none')
						.appendTo($(fileUpload.element).find('.files'))
						.fadeIn(function () {
						    console.log( 'FADE IN' );
						    console.log( this );
						    // Fix for IE7 and lower:
						    $(this).show();
							$('.template-download .preview')
								.css('overflow','visible')
								.css('width',350);
							console.log( $('.template-download .preview') );
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
              console.info($(this).parent());
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
