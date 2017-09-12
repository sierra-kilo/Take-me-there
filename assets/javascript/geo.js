var latStart;
var lngStart;
var latStartText;
var lngStartText;


$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
    latStart = position.coords.latitude;
    console.log(latStart);
    lngStart = position.coords.longitude;
    console.log(lngStart);
    latStartText = latStart.toString();
    console.log(latStartText);
    lngStartText = lngStart.toString();
    console.log(lngStartText);
    });
});
