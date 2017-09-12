﻿var randNum = Math.floor((Math.random() * 20) + 1);
var latStart = 37.825256;
var lngStart = -122.253574;
var latStartText = latStart.toString();
var lngStartText = lngStart.toString();
var keyword = ['whiskey'];
var name = "";
var address = "";
var priceLevel = "";
var rating = "";
var isOpen = "";
var radius = 50000;
var map;
var infowindow;
var recommendation;



function initMap() {
    var location = {};
    location.lat = latStart;
    location.lng = lngStart;

    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 10
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

        function getRecommendation(results, status) {
            test = results[randNum]
            if (test.rating > 4) {
                recommendation = test
                console.log('this is the recommendation');
                console.log(recommendation)
                return recommendation
            } else {
                return getRecommendation(results, status)
            }
        }
        recommendation = getRecommendation(results, status)
        // shant change 1
        // createMarker(results[randNum]);
        createMarker(recommendation);


        name = results[randNum].name;
        address = results[randNum].vicinity;
        priceLevel = results[randNum].price_level;
        rating = results[randNum].rating;
        isOpen = results[randNum].opening_hours;
        isOpen = isOpen.open_now;

        if (isOpen === true) {
            isOpen = 'Open';
        } else {
            isOpen = 'Closed';
        }
        var resultList = results
        console.log('this is the results list')
        console.log(resultList);
        // console.log(name);
        // console.log(address);
        // console.log(priceLevel);
        // console.log(rating);
        // console.log(isOpen);
        $("#info").append("<p style='margin:0px;'>"
            + name
            + "<br> Address: "
            + address
            + "<br> Price Level (out of 5): "
            + priceLevel
            + "<br> Rating: "
            + rating + "<br>"
            + isOpen + "</p>");

        $.ajax({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyDcPKxGxES3dhenheALWRDi2YymPDjEhjk',
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
                var lyftCost = lyftCostResults.cost_estimates[3].estimated_cost_cents_max;
                var lyftRideType = lyftCostResults.cost_estimates[3].ride_type;
                var partnerID = "WLapzhw1SD52gflntO7MI5QyiyQCKKeS"
                var deepLinkLyft = "https://lyft.com/ride?id=lyft&pickup[latitude]="
                    + latStartText
                    + "&pickup[longitude]="
                    + lngStartText
                    + "&partner="
                    + partnerID
                    + "&destination[latitude]="
                    + geoCodedlat
                    + "&destination[longitude]=";

                console.log(lyftCost + 'cents');
                console.log(lyftRideType);

                $("#lyft").html("<a style='color:white;' href='"
                    + deepLinkLyft
                    + "'> <img align='left' style='width:100px; padding-top: 5px; display:block;' src='https://qph.ec.quoracdn.net/main-qimg-4dba731b22a3bcac0a4b778159ec6ac9'/> <p style='margin:0px; display: inline-block; padding-left:25px;' id='lyftInfo'>Cost: $"
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
                    var lyftTime = lyftResults.eta_estimates[1].eta_seconds;
                    var lyftRideType = lyftResults.eta_estimates[1].ride_type;

                    console.log(lyftTime);
                    console.log(lyftRideType);

                    $("#lyftInfo").append("<br> ETA: " + lyftTime / 60 + " Minutes");
                });
            });

            //Uber Cost Ajax Call

            // $.ajax({
            //     url: 'https://api.uber.com/v1.2/estimates/price?start_latitude=' + latStartText + '&start_longitude=' + lngStartText + '&end_latitude=' + geoCodedlat + '&end_longitude=' + geoCodedlng,
            //     type: 'GET',
            //     beforeSend: function(xhr) {
            //         xhr.setRequestHeader("Authorization", "Token PFQZ7tdwz7A1HQCxtT4mGR041x_2wgpUtoIdF7gE");
            //     },
            //     success: function(response) {
            //         console.log(response);
            //     },
            //     error: function(error) {
            //         console.log(error);
            //     }
            // }).done(function(response) {
            //
            //     var uberResults = response;
            //     var uberCost = uberResults.prices[7].high_estimate;
            //     var uberRideType = uberResults.prices[7].display_name;
            //     var clientID = "WLapzhw1SD52gflntO7MI5QyiyQCKKeS"
            //     var deepLink = "https://m.uber.com/ul/?client_id="
            //         + clientID
            //         + "&action=setPickup&pickup[latitude]="
            //         + latStartText
            //         + "&pickup[longitude]="
            //         + lngStartText
            //         + "&pickup[nickname]=Current&dropoff[latitude]="
            //         + geoCodedlat
            //         + "&dropoff[longitude]="
            //         + geoCodedlng + "&dropoff[nickname]="
            //         + name
            //         + "[formatted_address]="
            //         + address
            //         + "&product_id=a1111c8c-c720-46c3-8534-2fcdd730040d&link_text=View%20team%20roster&partner_deeplink=partner%3A%2F%2Fteam%2F9383"
            //
            //     console.log(uberCost);
            //     console.log(uberRideType);
            //
            //
            //
            //     $("#uber").html("<a style='color:black;' href='"
            //         + deepLink
            //         + "'><img align='left' style='width:100px; padding-top: 5px; display:block;' src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/240px-Uber_App_Icon.svg.png'/> <p style='margin:0px; display: inline-block; padding-left:25px;' id='uber-info'> Cost: $"
            //         + uberCost + "<br>Type: "
            //         + uberRideType
            //         + "</p></a>");
            //
            //     //Uber ETA Ajax Call
            //
            //     $.ajax({
            //         url: 'https://api.uber.com/v1.2/estimates/time?start_latitude=' + latStartText + '&start_longitude=' + lngStartText,
            //         type: 'GET',
            //         beforeSend: function(xhr) {
            //             xhr.setRequestHeader("Authorization", "Token PFQZ7tdwz7A1HQCxtT4mGR041x_2wgpUtoIdF7gE");
            //         },
            //         success: function(response) {
            //             console.log(response);
            //         },
            //         error: function(error) {
            //             console.log(error);
            //         }
            //     }).done(function(response) {
            //
            //         var uberResults = response;
            //         var uberTime = uberResults.times[6].estimate;
            //         var uberRideType = uberResults.times[6].display_name;
            //
            //         console.log(uberTime);
            //         console.log(uberRideType);
            //
            //         $("#uber-info").append("<br> ETA: " + uberTime / 60 + " Minutes")
            //     });
            // });
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
