document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([listingLat, listingLon], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);


    // Marker for the listing location
    L.marker([listingLat, listingLon]).addTo(map)
        .bindPopup(`<b>${listingTitle}</b><br> Exact Location will be provided after booking`)
        .openPopup();

    window.searchLocation = function () {
        var location = document.getElementById('locationInput').value;
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;

                    // Update map view and add marker
                    map.setView([lat, lon], 12);
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${location}</b> <br>Lat: ${lat}, Lon: ${lon}`)
                        .openPopup();
                } else {
                    alert("Location not found!");
                }
            })
            .catch(error => console.log("Error:", error));
    };
});

