// API key and Secret for the session

var APIKey ='mDwvoqomEa5fxCiP21JBDfCukRDaZYMxceKYXzfwtRkJeicJ1j';
var secret ='mRZfJm0DLH12TpJJRgUtlnG5b32lHznG0Jyn2vBO';
var token_obj = new Object();
var animalInfoArray = new Array();


var storedAnimalLocation = new Array();
// API openweather
var APIOWMkey = 'c9299c81fa72cf0649fc417ca5d0c2b7';



$(document).ready(function(){

   
    getParams();
})
function getParams(){

     // Get the search params out of the URL (i.e. `?q=dog&location=92128`) 
  var searchParamsArr = document.location.search.split('&');

  var animalType = searchParamsArr[0].split('=').pop();
  var location = searchParamsArr[1].split('=').pop();


  searchApi(animalType, location);
}


// This is a POST request, because we need the API to generate a new token for us

function searchApi(animalType, location){


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
        var oauthData = data
         token_obj.access_token = data.token_type;
         token_obj.expires_in = data.expires_in;
         token_obj.token_type=data.token_type;
        return fetch(' https://api.petfinder.com/v2/animals?type='+animalType+ '&location='+location, {
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
                console.log(data.animals);

               
                // var queryStrings = new Array();
                for(let j = 0; j < data.animals.length; j++){
                    var id = data.animals[j].id;
                    var name = data.animals[j].name;
                    var gender=data.animals[j].gender;
                    var size =data.animals[j].size;
                    var age =data.animals[j].age;
                    var postcode = data.animals[j].contact.address.postcode;
                  //console.log(data.animals[j].contact.address);
                    animalInfoArray[j] = new Array(id,name,gender,size,age,postcode);       
                }

                }
                createTable(animalInfoArray,animalType);
           
        }
    );
    });
}
// get lat/long from openweather 
// function getCoord(city) {
// fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIOWMkey}`) 
// .then(function(response){
//     return response.json();
// }).then(function(data){
//     console.log(data);
//     // initMap(data.coord.lat, data.coord.lon);
// }) 
// }

// creating a table with fetch response

function createTable(animalInfoArray,animalType){
    // console.log(animalInfoArray);
    $('#pet_type').text(animalType);
    $('#animalTable').DataTable({
    
    "data" : animalInfoArray,
    "columns": [
        { "title": "Id" },
        { "title": "Name" },
        { "title": "Gender" },
        { "title": "Size" },
        { "title": "Age" },
        { "title": "Zip Code"},
        
    ]

    });
    
}

//   on click go to third page
    $('#animalTable').on('click', 'tbody tr', function() {

        //get textContent of the TD
        console.log('TR row textContent : ', this.textContent)

        var queryString = 'thirdpage.html?q=' + this.textContent ;

	document.location.assign(queryString);
    // getCoord();



    }) 

    // inside click action will call open weather search and hand it the 5th index of the array

