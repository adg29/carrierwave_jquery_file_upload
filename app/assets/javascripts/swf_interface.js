/**
 * Methods that bridge swf and js calls
 * @author jmckim
 */

/*
 * called when submit media button clicked in gallery navigation swf
 * passes id for which mosaic/city user is on.
 * 
 * Note: SWF is paused before this is called; closing user modals/interactions
 * needs to be followed by resumeSwf()
 */

var urlParams = {};
		(function () {
		    var e,
		        a = /\+/g,  // Regex for replacing addition symbol with a space
		        r = /([^&=]+)=?([^&]*)/g,
		        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
		        q = window.location.search.substring(1);
		
		    while (e = r.exec(q))
		      urlParams[d(e[1])] = d(e[2]);
		 })();
		 
		 
//Tracking
 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-29233609-1']);
 _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();


function trackMediaSubmit(s){
  	var mtype = (s.indexOf('video')!=-1) ? 'video' : 'photo';
  	trackMosaicEvent('upload',mtype,'submit');
 }

function trackMosaicEvent(eventId,mediaType,evtSource){
	var mt = (evtSource!="") ? evtSource+"-"+mediaType : mediaType;
	_gaq.push(['_trackEvent', "city-"+window.city_id_code, eventId, mt]);
}

function submitMedia(city_code,mediatype){
	trackMosaicEvent('upload',mediatype,'topnav');
	pauseSwf();

	try{
			var uploadtype = "";
			if( mediatype=="video") {
				uploadtype="?video=accept";
				$('label[for="picture_remote_file_url"]').html('Link Video');
				Cufon.replace( $('label[for="picture_remote_file_url"]') );
			}
			$('#swf_div')[0].pauseSwf();
			var src = "http://"+request_HTTP_HOST+"/cities/"+city_code.split('-')[1]+"/pictures/new"+uploadtype;
			$.modal('<iframe src="' + src + '" height="350" width="399" style="border:0">', {
				closeHTML:"close",
				containerCss:{
					background:"url(/assets/upload-modal-global.png) no-repeat transparent",
					width: 420,
					height:360,
					paddingTop: 15,
					paddingBottom: 5 
				},
				position: [60,],
				overlayClose:true,
				onOpen: function(dialog){
					dialog.overlay.fadeIn('slow', function () {
						dialog.data.hide();
						dialog.container.fadeIn('slow', function () {
							dialog.data.slideDown('slow');
						});
					});

				},
				onClose: function(dialog) {
					console.log('DIALOG');
					console.log( dialog );
					dialog.data.fadeOut('slow', function () {
						dialog.container.hide('slow', function () {
							dialog.overlay.slideUp('slow', function () {
								$.modal.close();
								if( window.mosaic_fb_share===true){
								// calling the API ...
								var obj = {
								  method: 'feed',
								  link: facebook_app_url + '/?controller=cities&id='+city_id+'&action=interative',
								  picture: request_HTTP_HOST + "/" + city_mosaic,
								  name: city_name + ' Intel Mosaic with Will.i.am',
								  caption: 'Join the mosaic by submitting media that best represents you and your city.',
								  description: ''
								};
								console.log(obj);

								FB.ui(obj, fb_callback);
								}else{
  									resumeSwf();
								}


							});
						});
					});
				}
			});

			// Closing animations
			$("#sample").modal({});
			

		} catch (e){}
	
}


function fb_callback(response) {
  resumeSwf();
}


function joinTheProjectClick(){
	top.window.location = "http://apps.facebook.com/368266769857206/?controller=cities&id="+city_id+"&action=interactive";
	
}

/*
 * called on user select of language drop down. 
 * param s - localization code associated with language selected.
 */
function setLanguage(loc_code){
	try{
		$('#swf_div')[0].setLanguage(loc_code);
	} catch (e){}
}

/*
 * called when user has changed mosaics/different city has been selected.
 */
function setCityMosaic(mosaic_code){
	


	top.window.location = "http://apps.facebook.com/368266769857206/?controller=cities&id="+mosaic_code+"&action=interactive";
}
/*
 * Can bee used to implement tracking; will get called when app state changes 
 * and on user interactions.
 */
function mosaicStateUpdate(cityid,appstate,behaviortrigger,itemid){
	
}

/*
 * calls Swf pause function...(like when displaying a modal above)
 */
function pauseSwf(d){
	
}
/*
 * different user logs in; or on log out: pass an ivalid id like -1
 * swf will modify findme behaviors for this mosaic.
 */
function setUserId(s){
	try{
		$('#swf_div')[0].setUserId(s);
	} catch (e){}
}

/*
 * calls Swf to resume from paused state.
 */
function resumeSwf(){
	try{
		$('#swf_div')[0].resumeSwf();
	} catch (e){}
}



function jslog(s){
	try{
		console.log('LOG');
		console.log(s);
	} catch (e){};
}
