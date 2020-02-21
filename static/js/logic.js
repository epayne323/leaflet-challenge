var myMap = L.map('map', {
    center: [39.761465, -98.490332],
    zoom: 4
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    attribution:
    "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: API_KEY
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// colors via colorbrewer
function colorScale(mag){
    let color = mag < 1 ? "#ffffb2" :
                mag < 2 ? "#fed976" :
                mag < 3 ? "#feb24c" :
                mag < 4 ? "#fd8d3c" :
                mag < 5 ? "#f03b20" :
                            "#bd0026"; 
    return color;   
}

var magScale = 25000;

d3.json(url).then(function(response) {
    response.features.forEach(quake => {
        let lat = quake.geometry.coordinates[1];
        let lon = quake.geometry.coordinates[0];
        let mag = quake.properties.mag;
        let place = quake.properties.place;
        L.circle([lat, lon], {
            color: "black",
            weight: 0,
            fillColor: colorScale(mag),
            fillOpacity: 0.75,
            radius: mag*magScale
        }).bindPopup(`${place} <br> Magnitude: ${mag}`)
        .addTo(myMap);
    });
});



var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0,1,2,3,4,5];
    
    div.innerHTML += '<h4 style="background-color: white">Magnitude</h4><br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background-color:' + colorScale(magnitudes[i] + 0.1) + '">' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '</i><br>' : '+');
    }

    return div;
};

legend.addTo(myMap);