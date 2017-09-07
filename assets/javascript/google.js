var authKey = "AIzaSyBk8YUrhUQ0_p8jmX5cEkag69N5Xhftxh8";

// These variables will hold the results we get from the user's inputs via HTML
var types = "bar";
var location = '';
var numResults = 0;
var radius = '5000'



// queryURLBase is the start of our API endpoint. The searchTerm will be appended to this when
// the user hits the search button
var queryURLBase =
'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.867766, -122.251984&radius=500&types=food&key=' + authKey


// FUNCTIONS
// ==========================================================

$( document ).ready(function() {

  // The AJAX function uses the queryURL and GETS the JSON data associated with it.
  // The data then gets stored in the variable called: "NYTData"

  $.ajax({
    url: queryURLBase,
    method: "GET"
}).done(function(places) {
    console.log(places);
  });

})
