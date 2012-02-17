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
function submitMedia(city_code,mediatype){
	//if (mediatype!="video" && mediatype!="image"){return;};
	pauseSwf();
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
	
	//window.location =
	top.window.location = "https://apps.facebook.com/testing_url/"+"?city_id="+mosaic_code;
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
	try{
		$('#swf_div')[0].pauseSwf();
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
		console.log(s);
	} catch (e){};
}