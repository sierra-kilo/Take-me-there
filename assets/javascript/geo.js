// var latStart;
// var lngStart;
// var latStartText;
// var lngStartText;


$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latStart = position.coords.latitude;
        localStorage.setItem("latStart", latStart);
        console.log(latStart);
        var lngStart = position.coords.longitude;
        localStorage.setItem("lngStart", lngStart);
        console.log(lngStart);
        var latStartText = latStart.toString();
        localStorage.setItem("latStartText", latStartText);
        console.log(latStartText);
        var lngStartText = lngStart.toString();
        localStorage.setItem("lngStartText", lngStartText);
        console.log(lngStartText);
    });
});
