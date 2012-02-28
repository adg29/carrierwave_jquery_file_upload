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

var cCityId ="city-1";
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
		 
function submitMedia(city_code,mediatype){
	var mcode = (mediatype=="image") ? "photo" : "video";
	cCityId = city_code;
	trackMosaicEvent('upload',mcode,'topnav');
	pauseSwf();
}


//Tracking
 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-29233609-1']);
 _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  


function trackMosaicEvent(eventId,mediaType,evtSource){
	var mt = (evtSource!="") ? evtSource+"-"+mediaType : mediaType;
	_gaq.push(['_trackEvent', cCityId, eventId, mt]);
	
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
	
	
	console.log("setCityMosaic"+mosaic_code);
	//top.window.location = "https://apps.facebook.com/testing_url/"+"?city_id="+mosaic_code;
}
/*
 * Can bee used to implement tracking; will get called when app state changes 
 * and on user interactions.
 */
function mosaicStateUpdate(cityid,appstate,behaviortrigger,itemid){
	
}
function setUserId(s){
	try{
		$('#swf_div')[0].setUserId(s);
	} catch (e){}
}
/*
 * calls Swf pause function...(like when displaying a modal above)
 */
function pauseSwf(){
	try{
		$('#swf_div')[0].pauseSwf();
	} catch (e){}
}
function joinTheProjectClick(){
	setCityMosaic(1);
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
		//console.log(s);
	} catch (e){};
}
