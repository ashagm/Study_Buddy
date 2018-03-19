
    var map;
    //creating map image only, everythings are based on lat, lng
    function initMap(){
    	var loc ={lat:-25.363, lng:131.044};
    	map =new google.maps.Map(document.getElementById("map"),{
    		center:loc,
    		zoom:8,
    		mapTypeId:'terrain'
    	});
    	var script = document.createElement('script');
    	script.src="https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";

    	//making pin on the google map 
    var makers = new google.maps.Marker({
    	position:loc,
    	map:map
    });
}
