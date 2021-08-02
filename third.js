var APIgoogleKey = 'AIzaSyCWnMYgAxmbFA2YqFGIZgNvXgFu3v70FXw';
var APIKey ='mDwvoqomEa5fxCiP21JBDfCukRDaZYMxceKYXzfwtRkJeicJ1j';
var secret ='mRZfJm0DLH12TpJJRgUtlnG5b32lHznG0Jyn2vBO';
var token_obj = new Object();
var weatherGeocodingAPIKey = '74188098e57f83a47b8566f3d3a0cabf'
// testing to see if map works
$(document).ready(function(){
  getParams();
  var zip = getZip();
  
  // console.log(`zip: ${zip}, state: ${state}`);
  getCoord(zip);
  // initMap();
});


function getZip(){
  var url = document.location.search;
  let ind=url.length;
  let zipCode = url.substring(ind-5, ind);
  
  
  return zipCode;
}
function initMap(lat, lng) {
  // console.log(lat, lng)
  // The location
  const location = { lat: parseFloat(lat), lng: parseFloat(lng)};
  // The map, centered at the location
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: location,
  });
  // The marker, positioned at the location
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });
}

function getCoord(zip) {
  fetch (`https://api.openweathermap.org/geo/1.0/zip?zip=${zip},US&appid=${weatherGeocodingAPIKey}`) 
  .then(function(response){
      return response.json();
  }).then(function(data){
      console.log(data);
      initMap(data.lat, data.lon);
  }); 
}



function getParams(){

  var searchParamsArr = document.location.search.split('&');
  // Get the query and format values
  var animalId = searchParamsArr[0].split('=').pop();
   getInfoById(animalId);
}

function getInfoById(Id){


  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + APIKey + '&client_secret=' + secret,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(function (resp) {

    // Return the response as JSON
    return resp.json();
   

}).then(function (data) {

    // Log the API data
    console.log('token', data);
     token_obj.access_token = data.token_type;
     token_obj.expires_in = data.expires_in;
     token_obj.token_type=data.token_type;
    return fetch(' https://api.petfinder.com/v2/animals/'+Id, {
        headers: {
            'Authorization': data.token_type + ' ' + data.access_token,
            'Content-Type': 'application/json'
        }
    }).then(function (resp) {

        // Return the API response as JSON
        return resp.json();
    
    }).then(function(data){
        
        if(!data){
            console.log('No results found!');
        }
        else{
            console.log(data);

            displayDetails(data)
        
        }
    }
);
});
  
}

function displayDetails(data){
$('#petName').text (data.animal.name);
$('#size').text(data.animal.size);
if(data.animal.description !== null)
{
var desc =escapeHtml(data.animal.description);
}
else{
  var desc = "No description found";
}
$('#description').text(desc);
if(data.animal.contact.address.address1 !== null){
$('#address').text(data.animal.contact.address.address1,
  data.animal.contact.address.city,data.animal.contact.address.state,
  data.animal.contact.address.country,data.animal.contact.address.postcode );
}
else{
  $('#address').text(data.animal.contact.address.city,data.animal.contact.address.state,
    data.animal.contact.address.country,data.animal.contact.address.postcode );
}
$("#breed").text(data.animal.breeds.primary);
if(data.animal.colors.primary !== null){
$('#color').text(data.animal.colors.primary);
}
else
{
  $('#color').text('data not available');
}
$('#status').text(data.animal.status);
if(data.animal.photos.length !=0)
{
  $('#image').attr("src",data.animal.photos[0].medium);
}
else{
  if(data.animal.species =="Duck"){
$('#image').attr("src",'./images/duck.jpg');
  }
  else if(data.animal.species == "Parrot"){
    $('#image').attr("src",'./images/parrot.jpg');
  }
  else if(data.animal.species == "chicken"){
    $('#image').attr("src",'./images/chicken.jpg');
  }
  else if (data.animal.species == "Dog"){
    $('#image').attr("src",'./images/dog.jpg');
  }
  else if(data.animal.species == "Horse"){
    $('#image').attr("src",'./images/horse.jpg');
  }
  else if (data.animal.species == "Cat"){
    $('#image').attr("src",'./images/cat.jpg');
  }
}
$('#image').css({'width' : '400px' , 'height' : '600px'});
}

// function to replace htmlcode
function escapeHtml(unsafe) {
  
   return unsafe.replace(/&amp;#39;/gi, "'");
}
