$.extend({
  jYoutube: function( url, size ){
    if(url === null || url==""){ return ""; }

    size = (size === null) ? "big" : size;
    var vid;
    var results;

    results = url.match("[\\?&]v=([^&#]*)");

    vid = ( results === null ) ? url : results[1];
    
    if ( vid == url ) {
    	vid = GetIdFromUrl(url);
	    if(size == "small"){
	      return "https://img.youtube.com/vi/"+GetIdFromUrl(url)+"/2.jpg";
	    }else {
	      var yid = GetIdFromUrl(url);
	      
	      return "https://img.youtube.com/vi/"+yid+"/0.jpg";
	    }
    }

    if(size == "small"){
      return "https://img.youtube.com/vi/"+vid+"/2.jpg";
    }else {
      return "https://img.youtube.com/vi/"+vid+"/0.jpg";
    }
  }
});

function GetIdFromUrl(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    } else {
        alert("Failed to read YouTube URL. Did you enter a valid link?");
    }
}

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
                                                $('.customfile').css('display','none');
						if(BrowserDetect.browser=="Safari" || BrowserDetect.browser=="Explorer"){
							$('.template-upload .preview').html('<img src="/assets/preview-fpo.jpg" />');
						}
			    		})
					.data('data', data);

			$('#upload_start').css('display','block');
			$('#description_input').css('display','block');
			$('.fileupload-buttonbar').css('left',200);
			$('.fileinput-button,#picture_file').css('display','none');
			$('.customfile').css('width',150);
	    	},
		done: function (e, data) {
			
			try{
				parent.onConfirmPanel = true;
			} catch (e){
				//console.log("error on setting parent var.");
				parent.setOnConfirmPanel(true);
			};
			
			
			
			$('#mosaic_copy').html('<h2 class="cufon-intel">Upload Complete!</h2>');
			Cufon.replace($('#mosaic_copy'));
			
			
			//on Success, allow the fb_share bool to live on outside of modal click.
			
			
			$('form#new_picture').css('display','none');
			$('.fileupload-buttonbar').css('display','none');

			var that = $(this).data('fileupload');
			if (data.context) {
			    data.context.each(function (index) {
				var file = ($.isArray(data.result) &&
					data.result[index]) || {error: 'emptyResult'};
				if (file.error) {
				    //that._adjustMaxNumberOfFiles(1);
				}

				$(this).fadeOut(function () {
				    that._renderDownload([file]);

				     that._renderDownload([file])
					.css('display', 'none')
					.replaceAll(this)
					.fadeIn(function () {
					    // Fix for IE7 and lower:
					    $(this).show();
						Cufon.replace($('.cufon-intel'));

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
					Cufon.replace($('.cufon-intel'));
					$('.template-download .preview')
						.css('overflow','visible')
						.css('width',350);
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
