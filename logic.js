// PART 1

// Create the map object
let myMap = L.map("map", {
    center: [40.0037, -102.0415], // center set to the border between Colorado and Nebraska
    zoom: 5 // set zoom size
});

// Adding the tile layer with custom style
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd', // this allows us to download files from different domains simultaniously
    maxZoom: 19 // set max zoom size
}).addTo(myMap); // addint to myMap variable

// Adding a map layer of state and country borders
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 0.5
}).addTo(myMap);

// Load GeoJSON data  of the earthquakes of the M1.0+ occured in the past 7 days
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Get the data with d3
d3.json(geoData).then(function(data) {
    console.log("GeoJSON data:", data) // show GeoJSON data on the console
    // Function to determine the color based on depth of the earthquake
    function getColor(depth) {
        return depth > 90 ? '#FF0000' :  // bright red
               depth > 70 ? '#FF4500' :  // bright orange
               depth > 50 ? '#FF8C00' :  // orange
               depth > 30 ? '#FFD700' :  // yellow-orange
               depth > 10 ? '#ADFF2F' : // yellow-green
                             '#00FF00';   // bright green
    }
    // Function to determine the size of the marker based on magnitude
    function getRadius(magnitude) {
        return magnitude * 4;
    }
    // Add GeoJSON data to the map with markers in circle style
L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: function(feature) { // set a style for each marker based on earthquake details
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.7
        };
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup( // set characteristics we want to pop up on each marker
            `<h3>Location: ${feature.properties.place}</h3><hr>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]} km</p>
            <p>Date & Time: ${new Date(feature.properties.time)}</p>`
        );
    }
}).addTo(myMap);

//Set up the legend to be in the bottom right, and sho legent title, depth and associated colors
let legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["#00FF00", "#ADFF2F", "#FFD700", "#FF8C00", "#FF4500", "#FF0000"];

    // Set legendInfo variable with white background styling
    let legendInfo = "<h1>Earthquake Depth (km)</h1>";

    // Add white background style
    div.style.backgroundColor = 'white';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';

    // Add the minimum and maximum
    div.innerHTML = legendInfo;
    
    // Loop through depths and colors to create legend items
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

// Adding the legend to the map
legend.addTo(myMap);

});


// PART 2 is optional




