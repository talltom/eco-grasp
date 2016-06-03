/* Styles */
var basemapPolygonStyle = {
  "fillColor": "#FFF",
  "fillOpacity": 1,
  "color": "#999",
  "weight": 0.4,
  "pane": 'bpane'
}

var riverBedStyle = {
  "color": "steelblue",
  "weight": 6,
  "pane": "rpane0"
}

var riverTopStyle = {
  "color": "#98d7dc",
  "weight": 3,
  "pane": "rpane1"
}

$("#map").css("height", $(window).height());

/* Map */
var map = L.map('map', {attributionControl:false, zoomControl:false}).setView([-6.289, 106.834], 15);

/*UX*/
map.scrollWheelZoom.disable();

/* Panes */
var basemapPane = map.createPane('bpane');
var riverPane0 = map.createPane('rpane0');
var riverPane1 = map.createPane('rpane1');

/* River Track */
var riverBedLayer = L.geoJson(null, {style:riverBedStyle}).addTo(map);
var riverTopLayer = L.geoJson(null, {style:riverTopStyle}).addTo(map);
$.getJSON('data/river/river.geojson', function(data){
  riverBedLayer.addData(data);
  riverTopLayer.addData(data);
});

/* Reports Modal */
_reportsModal = function(e){
  $('#reportsModalContent').empty();
  $('#reportsModalContent').append('<blockquote class="twitter-tweet" data-conversation="none"><a target="_blank"  href="'+e.target.feature.properties["Tweet URL"]+'">'+e.target.feature.properties.text+'</a></blockquote></div>');
  $('#reportsModal').modal('show');
  twttr.widgets.load($('#reportsModalContent'));

}

/* Reports */
var reportsLayer = L.geoJson(null,
  {onEachFeature: function(feature, layer){
    layer.on('click', function(e){
        _reportsModal(e);
      });
    }
  }).addTo(map);

$.getJSON('data/reports/reports_snapped.geojson', function(data){
  reportsLayer.addData(data)
});

/* Basemap Polygons */
var basemapLayer = L.geoJson(null, {style:basemapPolygonStyle}).addTo(map);
$.getJSON('data/basemap/osm_polygon_basemap.geojson', function(data){
    basemapLayer.addData(data);
  }
);

/* Responsive scaling map + taxonomy legend */
if ($(window).width() > 767){ // Large screens

  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  /* Add taxonomy legend to map */
  var taxonomy = L.control({position: 'topleft'});

  taxonomy.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'taxonomy'); // create a div with a class "taxonomy"
      this._div.innerHTML = '<h4>Tweet Taxonomy</h4>'; //|| Fluvial Landscape Ecologies
      return this._div;
  };

  taxonomy.addTo(map);

}
else { // Small screens

  /* Smaller map */
  $('#map').css("height", Math.round($(window).height()*0.5));

  /* Push taxonomy to column above map */
  $(".rank").addClass('taxonomy').append('<h4>Tweet taxonomy</h4>');
  map.setView([-6.288, 106.85], 15); // Re-center map
}
