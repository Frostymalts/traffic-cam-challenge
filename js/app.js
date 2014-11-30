// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$('document').ready(function() {

    $('#map').height($(window).height() - $('#map').position().top - 20);
    
    var mapElem = document.getElementById('map');

    var center = {
        lat: 47.6,
        lng: -122.3
    }

    var map = new google.maps.Map(mapElem, {
        center: center,
        zoom: 12
    });

    var infoWindow = new google.maps.InfoWindow();
    var cameras;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
        .done(function(data) {
            cameras = data;
            cameras.forEach(function(cameras) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(cameras.location.latitude),
                        lng: Number(cameras.location.longitude)
                    },
                    map: map,
                    icon: 'img/recorder.svg'
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                    map.panTo(this.getPosition());
                    var html = '<p>' + cameras.cameralabel + '</p>';
                    html += '<img src="' + cameras.imageurl.url + '"/>';
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });

                google.maps.event.addListener(map, 'click', function() {
                    infoWindow.close();
                });

                $('#search').bind('search keyup', function() {
                    var cameraName = cameras.cameralabel.toLowerCase();
                    var searchString = this.value.toLowerCase();
                    if (cameraName.indexOf(searchString) < 0) {
                        marker.setMap(null);
                    } else {
                        marker.setMap(map);
                    }
                });
            });
        })
        .fail(function(err) {
            console.log(err);
            alert('Sorry, unfortunately something went wrong!');
        });

    $(window).resize(function() {
        $('#map').height($(window).height() - $('#map').position().top - 20);
    });

});