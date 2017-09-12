var latStart = "";
var lngStart = "";
var latStartText = "";
var lngStartText = "";


$( document ).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
    latStart = position.coords.latitude;
    localStorage.setItem('latStart', latStart)
    console.log(latStart);
    lngStart = position.coords.longitude;
    localStorage.setItem('lngStart', lngStart)
    console.log(lngStart);
    latStartText = latStart.toString();
    localStorage.setItem('latStartText', latStartText)
    console.log(latStartText);
    lngStartText = lngStart.toString();
    localStorage.setItem('lngStartText', lngStartText)
    console.log(lngStartText);
    });
});

var maxPrice = $("input[name='dollars']:checked").val();
localStorage.setItem("maxPrice", maxPrice);
