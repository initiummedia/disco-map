/*global google geojson2011 */

var map;
var i = 0;
var lastInfoWindow = null;

var initial_zoom = 12;
var initial_lat = 22.36;
var initial_lng = 114.18;


//TODO: mobile responsiveness
if (window.innerWidth < 1024) {
    initial_zoom = 15;
    initial_lat = 22.36;
    initial_lng = 114.18;
}

function _getInfoWindowString (area) {
    'use strict';
    var result = '';

    //Add title
    result += '<h1 style="font-size=24px">'+area+'</h1>';

    //Add real infoWindow content
    return result;
}

function drawBoundary(data, targetMap) {
    'use strict';
    for (i=0;i<data.length;i++) {
        var entry = data[i];
        entry.mapLayer = new google.maps.Data();
        entry.mapLayer.loadGeoJson(entry.boundaryGeojsonPath);
        entry.mapLayer.setMap(targetMap);
    }
}

function styleLayers(data) {
    'use strict';
    // Fill in the real style settings
    for (i=0;i<data.length;i++) {
        var entry = data[i];
        entry.mapLayer.setStyle({
            strokeColor: 'black',
            fillColor: 'black'
        });
    }
}

function setInfoWindow(data, targetMap) {
    'use strict';
    for (i=0;i<data.length;i++) {
        var entry = data[i];
        var infoWindowPosition = new google.maps.LatLng(entry.infoWindowAnchor[0],
                                                        entry.infoWindowAnchor[1]);
        entry.infoWindow = new google.maps.InfoWindow({
            position: infoWindowPosition
        });

        google.maps.event.addListener(entry.mapLayer, 'click', function(entry){
            return function() {
                if (lastInfoWindow !== null) {
                    lastInfoWindow.close();
                }
                entry.infoWindow.open(targetMap, entry.mapLayer);
                lastInfoWindow = entry.infoWindow;
            };
        }(entry));
    }
}

function styleInfoWindows(data) {
    'use strict';
    for (i=0;i<data.length;i++) {
        var entry = data[i];
        entry.infoWindow.setContent(_getInfoWindowString(entry.area));
    }
}

function _readTextFile(path){
    var file = new XMLHttpRequest();
    file.open("GET", path, false);
    file.onreadystatechange = function () {
        if (file.readyState === 4) {
            if (file.status === 200 || file.status === 0) {
                return file.responseText;
            }
        }
    };
    file.send(null)
}

function initialize() {
    'use strict';
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: initial_zoom,
        center: {lat: initial_lat,
                 lng: initial_lng},
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    console.log('x');

    //FIXME

    var mapData = {};
    drawBoundary(geojson, map);
    styleLayers(mapData);
    setInfoWindow(mapData, map);
    styleInfoWindows(mapData);
}

google.maps.event.addDomListener(window, 'load', initialize);
