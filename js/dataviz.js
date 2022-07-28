// projet dataviz

// API LEAFLET AND ISS

let bounds = new L.LatLngBounds(
  new L.LatLng(49.5, -11.3),
  new L.LatLng(61.2, 2.5)
);
// set the map with leaflet
let map = L.map("map", {
  zoomSnap: 0.1,
}).setView([0, 0], 1.6);

map.setMaxBounds(map.getBounds());

// set the tile openstreetmap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 18,
  attribution: "© OpenStreetMap",
}).addTo(map);

let latlngs = [],
  latlngs2 = [];

let issIcon = L.icon({
  iconUrl: "./img-icon/iss.png",
  iconSize: [33, 30], // size of the icon => width/height
});
let marker = L.marker([48.856614, 2.3522219], { icon: issIcon });

//set map zoom and view according to zoom clientwidth
// tablets are between 768 and 922 pixels wide
// phones are less than 768 pixels wide
if (document.documentElement.clientWidth < 577) {
  // console.log("resize <577")
  map.setView([0, 0], 0);
  map.setMinZoom(0);
  // console.log(map.getZoom());
} else if (
  (document.documentElement.clientWidth < 1201) &
  (document.documentElement.clientWidth > 576)
) {
  // console.log("resize 576<1200")
  map.setView([0, 0], 1);
  map.setMinZoom(1);
  // console.log(map.getZoom());
} else if (
  (document.documentElement.clientWidth < 1401) &
  (document.documentElement.clientWidth > 1200)
) {
  // console.log("resize 576<1200")
  map.setView([0, 0], 1.3);
  map.setMinZoom(1.3);
  // console.log(map.getZoom());
} else if (document.documentElement.clientWidth > 1400) {
  // console.log("resize >1200")
  map.setView([0, 0], 1.6);
  map.setMinZoom(1.6);
  // console.log(map.getZoom());
}

// listen for screen resize events
window.addEventListener("resize", function (event) {
  // get the width of the screen after the resize event
  let width = document.documentElement.clientWidth;
  // tablets are between 768 and 922 pixels wide
  // phones are less than 768 pixels wide
  if (width < 577) {
    // console.log("resize <577")
    map.setView([0, 0], 0);
    map.setMinZoom(0);
    // console.log(map.getZoom());
  } else if ((width < 1201) & (width > 576)) {
    // console.log("resize 576<1200")
    map.setView([0, 0], 1);
    map.setMinZoom(1);
    // console.log(map.getZoom());
  } else if ((width < 1401) & (width > 1200)) {
    // console.log("resize 576<1200")
    map.setView([0, 0], 1.3);
    map.setMinZoom(1.3);
    // console.log(map.getZoom());
  } else if (width > 1200) {
    //console.log("resize >1200")
    map.setView([0, 0], 1.6);
    map.setMinZoom(1.6);
    //console.log(map.getZoom());
  }
});

//special html display for ocean and country 
const ul = document.querySelector('#ul');
let el = document.createElement("li");

//call api ISS and geoapify and unsplash
async function callIss() {
  let response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body and parse it => json object
    map.removeLayer(marker);
    let json = await response.json();
    let lat = json.latitude;
    let lon = json.longitude;

    //API Geoapify => 3000 requests/day free. For reverse geocoding to get the country of our iss lat/lon
    let geocode = await fetch("https://api.geoapify.com/v1/geocode/reverse?lat="+lat+"&lon="+lon+"&apiKey=6e906858295b4b2e820808e2e670d511")

    let geoJson = await geocode.json();
    let country = geoJson.features[0].properties.country;
    let ocean = geoJson.features[0].properties.ocean;

    //geolocalize iss with lat and long and the icon
    marker = L.marker([lat, lon], { icon: issIcon });

    // //unsplash
    // let unsplashKey ="_sf2avvjOlZgOtnH9ZBAjEpVp85tORwMPe5oG0WOBmw";
    // let unsplashSecretKey ="RcxoK3BfW4hjZHlVKUZZJ2fHW6Q8LY1B5evwPM4H72I";

    //html display with iss data
    document.getElementById("latitude").textContent =
      "Latitude : " + json.latitude;
    document.getElementById("longitude").textContent =
      "Longitude : " + json.longitude;
    document.getElementById("altitude").textContent =
      "Altitude : " + json.altitude + " kilometers";
    document.getElementById("speed").textContent =
      "Velocity : " + json.velocity + " km/h";
    document.getElementById("visibility").textContent =
      "Visibilty : " + json.visibility;
    document.getElementById("timing").textContent =
      "Timestamp : " + json.timestamp;

    if (country !== undefined){
      //find a random photo with unsplash
      // let unsplashUrl = "https://api.unsplash.com/photos/?client_id="+unsplashKey+"?client_secret="+unsplashSecretKey;
      // let unsplashImgCountry = await fetch (unsplashUrl);
      // console.log(unsplashImgCountry);

      //html
      el.innerHTML = "Country : " + country;
      ul.appendChild(el);
      marker.bindPopup("<b>This is the ISS !</b><br>It's now in <b>"+country+"</b> !").openPopup();
      map.addLayer(marker);
    } else if (ocean != undefined){
        el.innerHTML = "Ocean : " + ocean;
        ul.appendChild(el);
        marker.bindPopup("<b>This is the ISS !</b><br>It's now in <b>"+ocean+"</b>!").openPopup();
        map.addLayer(marker);
    }
    
    // compare iss's lon with map's lon to avoid the red line back
    if ((lon < 180) & (lon >= 0)) {
      //console.log("dans les plus");
      latlngs.push([lat, lon]);
      // create a red polyline from an array of LatLng points => for the trajectory
      L.polyline(latlngs, { color: "red" }).addTo(map);
    } else if (lon < 0) {
      //console.log("dans les moins");
      latlngs2.push([lat, lon]);
      L.polyline(latlngs2, { color: "red" }).addTo(map);
    }
    setTimeout(callIss, 5000);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}
callIss();

// API APOD de la NASA
// key NASA Api : ERBNcbwVFS3Fpc1b2eAyhwKb97srt7C0Zyu94A3s

let req = new XMLHttpRequest();
let url = "https://api.nasa.gov/planetary/apod?api_key=";
let api_key = "5B6oJsSCQyekXZvNOKpsUhRPl1e7FHqjIAyHpybk";
req.open("GET", url + api_key);
req.send();

req.addEventListener("load", function () {
  if (req.status == 200 && req.readyState == 4) {
    let response = JSON.parse(req.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }
});

// Handle with the date button value

async function imgOnClick() {
  let response = await fetch(
    `https://api.nasa.gov/planetary/apod?date=${myDate}&api_key=5B6oJsSCQyekXZvNOKpsUhRPl1e7FHqjIAyHpybk`
  );
  if (response.ok) {
    // if HTTP-status is 200-299
    let json = await response.json();
    console.log(json);
    document.getElementById("title").textContent = json.title;
    document.getElementById("date").textContent = json.date;
    document.getElementById("pic").src = json.hdurl;
    document.getElementById("explanation").textContent = json.explanation;
  }
}

function today() {
  let date = new Date();
  let year = date.getFullYear();
  let month = () => {
    return date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  };
  let day = () => {
    return date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  };
  let today = year + "-" + month() + "-" + day();
  return today;
}

let btn = document.getElementById("btn");
let dateHTML = document.getElementById("dateUser");
dateHTML.setAttribute("value", today());
dateHTML.setAttribute("max", today());
let myDate = today();

dateHTML.onchange = () => (myDate = dateHTML.value);

btn.onclick = imgOnClick;
