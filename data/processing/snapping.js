//Snap reports to river using turfjs

//Modules
var turf = require('turf'); //geoprocessing
var fs = require('fs'); //io

//Data
var reports = fs.readFileSync('../reports/reports.geojson');
reports = JSON.parse(reports);

var river = fs.readFileSync('../river/river.geojson');
river = JSON.parse(river);

//Processing
var snapped = [];
for (var i = 0; i < reports.features.length; i++){
  var newFeature = turf.pointOnLine(river.features[0], reports.features[i]);
  var propertyKeys = Object.keys(reports.features[i].properties);
  for (var j = 0; j < propertyKeys.length; j++){
    newFeature.properties[propertyKeys[j]] = reports.features[i].properties[propertyKeys[j]];
  }
  //for (var j = 0; j < reports.features[i].properties.length; j++){
  //console.log(propertyKeys);
    //newfeature.properties[reports.features[i].properties[j]]
  //}
  //newfeature.properties
  //onsole.log(turf.pointOnLine(river.features[0], reports.features[i]))
  snapped.push(newFeature);
}

//Output
fs.writeFileSync('../reports/reports_snapped.geojson', JSON.stringify(turf.featurecollection(snapped)));
console.log('saved reports_snapped.geojson');
