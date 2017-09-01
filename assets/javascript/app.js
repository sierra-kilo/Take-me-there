var googApiKey = AIzaSyDq6YblPQXWT8TmL8AGstREqekjf425vew;

var latlon;

navigator.geolocation.getCurrentPosition(function(position) {
	latlon = position.coords.latitude + "," + position.coords.longitude;
});

var googApiQuery = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + latlon + "&radius=9000&opennow=true&keyword=" + keyword + "&key=" + googApiKey;
