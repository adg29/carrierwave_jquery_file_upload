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
	window.onConfirmPanel = false;
	
	//src set onShow event - clears up IE Jquery Errors relating to IFrames and simplemodal.
	function setSrc(){
		var frameSource = protocolstr+request_HTTP_HOST+"/cities/"+city_code.split('-')[1]+"/pictures/new"+uploadtype;
	   $('#uploadmodaliframe').attr("src", frameSource);
	}
	//console.log("onopen>"+window.onConfirmPanel);
	try{
			var uploadtype = "";
			if( mediatype=="video") {
				uploadtype="?video=accept";
			}
			$('#swf_div')[0].pauseSwf();
			//var protocolstr = (window.location.href.indexOf("review.kbsp.com")!=-1) ? "http://" : "http://";  // wip dev
			var protocolstr = (window.location.href.indexOf("<%= request.env['HTTP_HOST'] %>")!=-1) ? "http://" : "https://";  // git
			var src = protocolstr+request_HTTP_HOST+"/cities/"+city_code.split('-')[1]+"/pictures/new"+uploadtype;
			
			// w399 h350
			$.modal('<iframe id="uploadmodaliframe" src="" height="350" width="399" style="border:0px" frameBorder="0" scrolling="no">', {
				closeHTML:"close",
				containerCss:{
					background:"url(/assets/upload-modal-global.png) no-repeat transparent",
					width: 420,
					height:360,
					paddingTop: 15,
					paddingBottom: 5 
				},
				onShow: function(dialog) {
					setSrc();
					//$('#uploadmodaliframe').click( function(){ return false; } );
					//$('body').click(function(){ $.modal.close(); } );
				},
				position: [60,260],
				overlayClose:true,
				onOpen: function(dialog){
					dialog.overlay.fadeIn('slow', function () {
						dialog.data.hide();
						dialog.container.fadeIn('slow', function () {
							if( mediatype!="video" ){
								$('#picture_remote_file_url').css('display','none');
								$('label[for="picture_remote_file_url"]').css('display','none');
							}else{
								$('label[for="picture_remote_file_url"]').html('Link Video');
								Cufon.replace( $('label[for="picture_remote_file_url"]') );
							}
							dialog.data.slideDown('slow');
						});
					});
				},
				onClose: function(dialog) {
					dialog.data.fadeOut('slow', function () {
						dialog.container.hide('slow', function () {
							dialog.overlay.slideUp('slow', function () {
								$.modal.close();
								
								//console.log("onclose>"+window.onConfirmPanel+"|"+window.mosaic_fb_share);
								if( window.mosaic_fb_share==true && window.onConfirmPanel==true){
								
								// calling the API ...
								var obj = {
								  method: 'feed',
								  link: facebook_app_url + '/?controller=cities&id='+city_id+'&action=interative',
								  picture: request_HTTP_HOST + "/" + city_mosaic,
								  name: city_name + ' Intel Mosaic with Will.i.am',
								  caption: 'Join the mosaic by submitting media that best represents you and your city.',
								  description: 'Your City. His Inspiration.<br/>I just posted content to the Intel Ultrabook TM project. Inspiration for will.i.am.'
								};
								//console.log(obj);

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

//setter from child iframe...
function setOnConfirmPanel(val){
	window.onConfirmPanel = val;
	//console.log("setter called from child>"+val);
}

function fb_callback(response) {
  resumeSwf();
}


function joinTheProjectClick(){
	try {
		top.window.location.href = facebook_app_url + "/?controller=cities&id=" + city_id + "&action=interactive";
	} catch (e){
		window.top.location = facebook_app_url + "/?controller=cities&id=" + city_id + "&action=interactive";
	} 
}

/*
 * called on user select of language drop down. 
 * param s - localization code associated with language selected.
 * validates against valid language codes in strings xml, if not valid, does not change language.
 * 
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
	//top.window.location = facebook_app_url + "/?controller=cities&id="+mosaic_code+"&action=interactive";
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
function pauseSwf(){
	$('#swf_div')[0].pauseSwf();
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


//Handles closes upload & video modals in cases where overlay does not get click [ie].
function clickfromswf(){
	$.modal.close();
	//console.log("onclosefromclick>"+window.onConfirmPanel+"|"+window.mosaic_fb_share);
	if (window.mosaic_fb_share == true && window.onConfirmPanel == true) {
		window.onConfirmPanel = false;
		// calling the API ...
		var obj = {
			method: 'feed',
			link: facebook_app_url + '/?controller=cities&id=' + city_id + '&action=interative',
			picture: request_HTTP_HOST + "/" + city_mosaic,
			name: city_name + ' Intel Mosaic with Will.i.am',
			caption: 'Join the mosaic by submitting media that best represents you and your city.',
			description: 'Your City. His Inspiration.<br/>I just posted content to the Intel Ultrabook TM project. Inspiration for will.i.am.'
		};
		FB.ui(obj, fb_callback);
			}else{
  			resumeSwf();
		}
}


function jslog(s){
	try{
		//console.log('LOG');
		//console.log(s);
	} catch (e){};
}
