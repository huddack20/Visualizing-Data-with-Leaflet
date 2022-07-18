  
// Adding light mode tile layer to the map
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}); 

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
	"Street": street,
	"Satellite": googleSat,
	"Topography": topo
};

// Create map object
var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
	layers: [street] 
});

L.control.layers(baseMaps, {
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Grab the data with d3
d3.json(url).then(function(response) {

	// Create function to color cicles according to earthquake magnitudes
	function getColor(d) {
    return d >= 550 ? "rgb(i128, 0, 0)" :
	   d >= 500 ? "rgb(220, 20, 60)" :
	   d >= 450 ? "rgb(255, 127, 80)" :
	   d >= 400 ? "rgb(150, 128, 114)" :
	   d >= 350 ? "rgb(255, 165, 0)" :
	   d >= 300 ? "rgb(255, 215, 0)" :
	   d >= 200 ? "rgb(0, 100, 0)" :
           d >= 150 ? "rgb(199, 21, 133)" :
           d >= 100 ? "rgb(0, 0, 255)" :
	   d >= 50 ? "rgb(0, 255, 255)" :
	   d >= 25 ? "rgb(107, 142, 35)" :
	   d >= 20 ? "rgb(0, 100, 0)" :
	   d >= 15 ? "rgb(173, 255, 0)" :
	   d >= 10 ? "rgb(0, 128, 0)" :
	   d >= 0 ? "rgb(0, 255, 127)" :
  	   "rgb(0, 0, 0)";
	}
	
	// Grab the features data
	var features = response.features;

	for (var i = 0; i < features.length; i++) {
		
		//Define variable depth and coordinates of the earthquakes
		// var magnitutes = features[i].properties.mag;
		var coordinates = features[i].geometry.coordinates;

		// Add circles to map
		L.circle(
			[coordinates[1], coordinates[0]], {
				fillOpacity: 0.75,
				fillColor: getColor(coordinates[2]),
				color: "black",
				weight: 0.5,
				radius: coordinates[2] * 2000
			}).bindPopup("<h3>" + features[i].properties.place +
				"</h3><hr><p>" + new Date(features[i].properties.time) + 
				'<br>' + '[' + coordinates[1] + ', ' + coordinates[0] + ', ' +coordinates[2] + ']' + "</p>").addTo(myMap);
	};

	

	// Legend for the chart
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (myMap) {
	
		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 15, 20, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550];

		// loop through our magnitude intervals and generate a label with a colored square for each interval
		for (var i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i]) + ' "></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		return div;
	};
	legend.addTo(myMap);

});
