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
  iconUrl: "../img-icon/iss.png",
  iconSize: [33, 30], // size of the icon => width/height
});
let marker = L.marker([48.856614, 2.3522219], { icon: issIcon });

//set map zoom and view according to zoom clientwidth
  // tablets are between 768 and 922 pixels wide
  // phones are less than 768 pixels wide
if (document.documentElement.clientWidth < 577) {
  // console.log("resize <577")
  map.setView([0, 0], 0);
    // console.log(map.getZoom());
}  else  if (document.documentElement.clientWidth < 1201 & document.documentElement.clientWidth > 576){
  // console.log("resize 576<1200")
  map.setView([0, 0], 1);
  // console.log(map.getZoom());
} else  if (document.documentElement.clientWidth < 1401 & document.documentElement.clientWidth > 1200){
  // console.log("resize 576<1200")
  map.setView([0, 0], 1.3);
  // console.log(map.getZoom());
} else if (document.documentElement.clientWidth > 1400){
  // console.log("resize >1200")
  map.setView([0, 0], 1.6);
  // console.log(map.getZoom());
}

// listen for screen resize events
window.addEventListener('resize', function(event){
  // get the width of the screen after the resize event
  let width = document.documentElement.clientWidth;
  // tablets are between 768 and 922 pixels wide
  // phones are less than 768 pixels wide
  if (width < 577) {
    // console.log("resize <577")
    map.setView([0, 0], 0);
    // console.log(map.getZoom());
  }  else  if (width < 1201 & width > 576){
    // console.log("resize 576<1200")
    map.setView([0, 0], 1);
    // console.log(map.getZoom());
  } else  if (width < 1401 & width > 1200){
    // console.log("resize 576<1200")
    map.setView([0, 0], 1.3);
    // console.log(map.getZoom());
  } else if (width > 1200){
    //console.log("resize >1200")
    map.setView([0, 0], 1.6);
    //console.log(map.getZoom());
  }
});

async function callIss() {
  let response = await fetch("http://api.open-notify.org/iss-now.json");
  if (response.ok) {
    // if HTTP-status is 200-299
    // get the response body and parse it => json object
    map.removeLayer(marker);
    let json = await response.json();
    let lat = json.iss_position.latitude;
    let lon = json.iss_position.longitude;

    // geolocalize iss with lat and long and the icon
    marker = L.marker([lat, lon], {icon: issIcon});
    map.addLayer(marker);

    // compare iss's lon with map's lon to avoid the red line back
    if ((lon < 180) & (lon >= 0)) {
      //console.log("dans les plus");
      latlngs.push([lat, lon]);
      // create a red polyline from an array of LatLng points => for the trajectory
      L.polyline(latlngs, {color: "red"}).addTo(map);
    } else if (lon < 0) {
      //console.log("dans les moins");
      latlngs2.push([lat, lon]);
      L.polyline(latlngs2, {color: "red"}).addTo(map);
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

