
var resultList = [];
var latStart = parseFloat(localStorage.getItem('latStart'));
var lngStart = parseFloat(localStorage.getItem('lngStart'));
var latStartText = localStorage.getItem('latStartText');
var lngStartText = localStorage.getItem('lngStartText');
var radius = parseInt(localStorage.getItem('radius'));
var keyword = localStorage.getItem('keyword');
var name = "";
var address = "";
var priceLevel = parseInt(localStorage.getItem('maxPrice'));
var minRating = parseFloat(localStorage.getItem('minRating'));
var isOpen = "";
var map;
var infowindow;
var recommendation;
var randNum;
var visited = [];


$('.task').on('click', function(){
    keyword = $(this).data('sub');
    // console.log($(this).data('sub'));
    localStorage.setItem("keyword", keyword);
    initMap();
});

$('.btn[name=submit]').click(function() {

    var radius = $("input[name='distance']:checked").val();
    localStorage.setItem("radius", radius);
    console.log(radius);
    var minRating = $("input[name='stars']:checked").val();
    localStorage.setItem("minRating", minRating);
    console.log(minRating);
    var maxPrice = $("input[name='dollars']:checked").val();
    localStorage.setItem("maxPrice", maxPrice);
    console.log(maxPrice);

});



function initMap() {
    var location = {};
    location.lat = latStart;
    location.lng = lngStart;

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom:10
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: location,
        radius: radius,
        type: ['bar'],
        keyword: keyword
    }, callback);


}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {

        resultList = results
        console.log('this is the results list')
        console.log(resultList);

        function getRecommendation() {
            randNum = Math.floor((Math.random() * resultList.length));
            var test = results[randNum];
            console.log(test);

            if (test.rating > minRating) {
                recommendation = test

                console.log('this is the recommendation');
                console.log(recommendation)
                return recommendation
            } else {
                getRecommendation();
            }
        }
        recommendation = getRecommendation();
        // shant change 1
        // createMarker(results[randNum]);
        createMarker(recommendation);

        name = recommendation.name;
        address = recommendation.vicinity;
        priceLevel = recommendation.price_level;
        rating = recommendation.rating;
        isOpen = recommendation.opening_hours;
        isOpen = isOpen.open_now;


        if (isOpen === true) {
            isOpen = 'Open';
        } else {
            isOpen = 'Closed';
        }

        if (priceLevel === undefined) {
            priceLevel = 'N/A';
        }

        // console.log(name);
        // console.log(address);
        // console.log(priceLevel);
        // console.log(rating);
        // console.log(isOpen);
        $("#info").html("<p style='margin:0px;'>"
            + name
            + "<br> Address: "
            + address
            + "<br> Price Level (out of 5): "
            + priceLevel
            + "<br> Rating: "
            + rating + "<br>"
            + isOpen + "</p>");

        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyD2xSa6BNQRyT5tJFK6Hhf6RPJzGrN35BI',
            method: "GET",
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
            // After the data comes back from the API

        }).done(function(response) {

            var geoCoded = response;
            geoCodedlat = geoCoded.results[0].geometry.location.lat;
            geoCodedlng = geoCoded.results[0].geometry.location.lng;

            console.log(geoCodedlat);
            console.log(geoCodedlng);

            //Lyft Cost Ajax Call

            $.ajax({

                url: 'https://api.lyft.com/v1/cost?start_lat=' + latStartText + '&start_lng=' + lngStartText + '&end_lat=' + geoCodedlat + '&end_lng=' + geoCodedlng,
                type: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer otu4KK6PnP6kPSLijMWxFgjoHFIQk5aSTZ16ba98cuO23dCUy/8e1Dw37bEOEerpQJLZW3/tKbPw5iLGAWdwVOFGFUa6Nfd8xZ/HRSf0bTV8FNvAxYePDIE=");
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }


            }).done(function(response) {

                var lyftCostResults = response;
                var lyftCost = "";
                var lyftRideType = "";
                var partnerID = "WLapzhw1SD52gflntO7MI5QyiyQCKKeS"
                var deepLinkLyft = "https://lyft.com/ride?id=lyft&pickup[latitude]="
                    + latStartText
                    + "&pickup[longitude]="
                    + lngStartText
                    + "&partner="
                    + partnerID
                    + "&destination[latitude]="
                    + geoCodedlat
                    + "&destination[longitude]="
                    + geoCodedlng;

                for (var i = 0; i < lyftCostResults.cost_estimates.length; i++){


                    if(lyftCostResults.cost_estimates[i].ride_type === 'lyft'){

                        lyftCost = lyftCostResults.cost_estimates[i].estimated_cost_cents_max;
                        lyftRideType = lyftCostResults.cost_estimates[i].ride_type;
                    }


                }

                console.log(lyftCost + 'cents');
                console.log(lyftRideType);

               $("#lyft").html("<a style='color:white;' href='"
                    + deepLinkLyft
                    + "'> <img align='left' style='width:100px; padding: 15px 5px 0 5px; display:block;' src='assets/img/lyft-logo.png'/> <p style='margin:0px; display: inline-block; padding-left:25px;' id='lyftInfo'>Cost: $"
                    + lyftCost / 100 + "<br> Type: "
                    + lyftRideType
                    + "</p></a>");

                //Lyft ETA Ajax Call

                $.ajax({
                    url: 'https://api.lyft.com/v1/eta?lat=' + latStartText + '&lng=' + lngStartText,
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer otu4KK6PnP6kPSLijMWxFgjoHFIQk5aSTZ16ba98cuO23dCUy/8e1Dw37bEOEerpQJLZW3/tKbPw5iLGAWdwVOFGFUa6Nfd8xZ/HRSf0bTV8FNvAxYePDIE=");
                    },
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                }).done(function(response) {




                    var lyftResults = response;
                    var lyftTime = "";
                    var lyftRideType = "";

                    for (var h = 0; h < lyftResults.eta_estimates.length; h++){


                    if(lyftResults.eta_estimates[h].ride_type === 'lyft'){

                        lyftTime = lyftResults.eta_estimates[h].eta_seconds;
                        lyftRideType = lyftResults.eta_estimates[h].ride_type;
                    }


                }

                    console.log(lyftTime);
                    console.log(lyftRideType);

                    $("#lyftInfo").append("<br> ETA: " + lyftTime / 60 + " Minutes");
                });
            });

            // Uber Cost Ajax Call

            $.ajax({
                url: 'https://api.uber.com/v1.2/estimates/price?start_latitude=' + latStartText + '&start_longitude=' + lngStartText + '&end_latitude=' + geoCodedlat + '&end_longitude=' + geoCodedlng,
                type: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Token PFQZ7tdwz7A1HQCxtT4mGR041x_2wgpUtoIdF7gE");
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            }).done(function(response) {

                var uberResults = response;
                var uberCost = "";
                var uberRideType = "";
                var clientID = "WLapzhw1SD52gflntO7MI5QyiyQCKKeS"
                var deepLink = "https://m.uber.com/ul/?client_id="
                    + clientID
                    + "&action=setPickup&pickup[latitude]="
                    + latStartText
                    + "&pickup[longitude]="
                    + lngStartText
                    + "&pickup[nickname]=Current&dropoff[latitude]="
                    + geoCodedlat
                    + "&dropoff[longitude]="
                    + geoCodedlng + "&dropoff[nickname]="
                    + name
                    + "[formatted_address]="
                    + address
                    + "&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383"


                for (var j = 0; j <uberResults.prices.length; j++){

                    if(uberRideType = uberResults.prices[j].display_name === 'uberX'){

                        uberCost = uberResults.prices[j].high_estimate;
                        uberRideType = uberResults.prices[j].display_name;
                    }


                }

                console.log(uberCost);
                console.log(uberRideType);



                $("#uber").html("<a style='color:black;' href='"
                    + deepLink
                    + "'><img align='left' style='width:100px; padding: 15px 5px 0 5px; display:block;' src='assets/img/uber-logo.png'/><p style='margin:0px; display: inline-block; padding-left:25px;' id='uber-info'> Cost: $"
                    + uberCost + "<br>Type: "
                    + uberRideType
                    + "</p></a>");

                //Uber ETA Ajax Call

                $.ajax({
                    url: 'https://api.uber.com/v1.2/estimates/time?start_latitude=' + latStartText + '&start_longitude=' + lngStartText,
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Token PFQZ7tdwz7A1HQCxtT4mGR041x_2wgpUtoIdF7gE");
                    },
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                }).done(function(response) {

                    var uberTimeResults = response;
                    var uberTime = "";
                    var uberRideType = "";

                    for (var k = 0; k <uberTimeResults.times.length; k++){

                    if(uberRideType = uberTimeResults.times[k].display_name === 'uberX'){

                        uberTime = uberTimeResults.times[k].estimate;
                        uberRideType = uberTimeResults.times[k].display_name;
                    }


                }

                    console.log(uberTime);
                    console.log(uberRideType);

                    $("#uber-info").append("<br> ETA: " + uberTime / 60 + " Minutes")
                });
            });
        });
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

var config = {
    apiKey: "AIzaSyD2xSa6BNQRyT5tJFK6Hhf6RPJzGrN35BI",
    authDomain: "tact-masters-you-drive.firebaseapp.com",
    databaseURL: "https://tact-masters-you-drive.firebaseio.com",
    projectId: "tact-masters-you-drive",
    storageBucket: "tact-masters-you-drive.appspot.com",
    messagingSenderId: "479313795676"
};
firebase.initializeApp(config);

var database = firebase.database();

$(".taxi").on("click", function(){
    database.ref().push({
        name: name,
        lat: geoCodedlat,
        lng: geoCodedlng
    })
})

database.ref().on("child_added", function(snap){
    var sv = snap.val();
    visited.push(sv);
    if (visited.length > 5){
        visited.shift();
    }
    renderRecent();
})

function renderRecent(){
    if (visited.length < 6) {
        var vis = visited[visited.length - 1];
        var $rec = $("<div data-lat='" + vis.lat + "' data-lng='" + vis.lng + "' class='h2-index recentBar'>")
        $rec.html(vis.name);
        $(".recents").append($rec);
    }
    if (visited.length == 5) {
        $('.recents').find('div').first().remove();
    }
}
