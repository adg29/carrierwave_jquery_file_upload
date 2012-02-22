$.extend({
  jYoutube: function( url, size ){
    if(url === null || url==""){ return ""; }

    size = (size === null) ? "big" : size;
    var vid;
    var results;

    results = url.match("[\\?&]v=([^&#]*)");

    vid = ( results === null ) ? url : results[1];

    if(size == "small"){
      return "http://img.youtube.com/vi/"+vid+"/2.jpg";
    }else {
      return "http://img.youtube.com/vi/"+vid+"/0.jpg";
    }
  }
});

$(function () {


    var inputs = $('#new_picture :input[type=text]');
    
    clearFields(inputs);
    
    function clearFields (inputs) {
      $('.ui-state-error-text').remove();
      $.each(inputs, function(index, field){
        $(field).focus(function(){
          $(field).removeClass("ui-state-error");
          $(field).next().remove();
        });
      });
    };
  
    // Initialize the jQuery File Upload widget:
    $('#fileupload')
    	.bind('fileuploadfail', function (e, data) {
	})
    	.fileupload({
      		maxNumberOfFiles: 10,
      		acceptFileTypes: /\.(jpg|jpeg|gif|png|JPG|JPEG|GIF|PNG)$/,
		previewMaxWidth: 180,
		previewMaxHeight: 360,
	        add: function (e, data) {
			var that = $(this).data('fileupload');
			data.context = that._renderUpload(data.files)
			    .appendTo(
			    	$(this).find('.files'))
					.fadeIn(function () {
						// Fix for IE7 and lower:
						$(this).show();
			    		})
					.data('data', data);

			console.log('drop or add');
			$('#upload_start').css('display','block');
			$('#description_input').css('display','block');
			$('.fileupload-buttonbar').css('left',200);
			$('.fileinput-button,#picture_file').css('display','none');
			$.each(data.files, function (index, file) {
				
			});
	    	},
		done: function (e, data) {
			$('#mosaic_copy').html('<h2>Upload Complete!</h2>');

			$('form#new_picture').fadeOut();
			$('.fileupload-buttonbar').fadeOut();

			var that = $(this).data('fileupload');
			if (data.context) {
			    data.context.each(function (index) {
				var file = ($.isArray(data.result) &&
					data.result[index]) || {error: 'emptyResult'};
				if (file.error) {
				    that._adjustMaxNumberOfFiles(1);
				}

				$(this).fadeOut(function () {
				    console.log('renderDownload');
				    console.log( file );
				    that._renderDownload([file])
					.css('display', 'none')
					.replaceAll(this)
					.fadeIn(function () {
					    // Fix for IE7 and lower:
					    $(this).show();
						$('.template-download .preview')
							.css('overflow','visible')
							.css('width',350);

					});
				});
			    });
			} else {
			    that._renderDownload(data.result)
				.css('display', 'none')
				.appendTo($(this).find('.files'))
				.fadeIn(function () {
				    // Fix for IE7 and lower:
				    $(this).show();
					$('.template-download .preview')
						.css('overflow','visible')
						.css('width',350);
					console.log( $('.template-download .preview') );
				});
			}

		}

    	});
    

    // Open download dialogs via iframes,
    // to prevent aborting current uploads:
    $('#fileupload .files a:not([target^=_blank])').live('click', function (e) {
        e.preventDefault();
        $('<iframe style="display:none;"></iframe>')
            .prop('src', this.href)
            .appendTo('body');
    });
    
    
    $('#fileupload').bind('fileuploadsend', function (e, data) {
      
      var values = {};
      
      $.each($('#new_picture').serializeArray(), function(i, field) {
          values[field.name] = field.value;
      });

      var title = values["picture[title]"]
      var description = values["picture[description]"]
      
      /*
      // Validates all input fields for each download
      $.each( values, function(k, v){
        if (v == 0) {
          $('input[name="' + k + '"]').addClass("ui-state-error");
          $('input[name="' + k + '"]').after("<span class=\"ui-state-error-text\"> can't be blank!</span>");
        }
       });
      */

    });
    
    $('#fileupload').bind('fileuploadprogressall', function (e,data) {
      var progress = parseInt(data.loaded / data.total * 100, 10);
    });

});
