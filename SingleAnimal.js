var APIKey ='mDwvoqomEa5fxCiP21JBDfCukRDaZYMxceKYXzfwtRkJeicJ1j';
var secret ='mRZfJm0DLH12TpJJRgUtlnG5b32lHznG0Jyn2vBO';
var token_obj = new Object();
let objArray = [];

var animalInfoArray = new Array();
$(document).ready(function(){

   
    getParams();
})
function getParams(){

     // Get the search params out of the URL (i.e. `?q=dog&location=92128`) and convert it to an array (i.e. ['?q=london', 'format=photo'])
  var searchParamsArr = document.location.search.split('&');

  // Get the query and format values
  var animalType = searchParamsArr[0].split('=').pop();
  var location = searchParamsArr[1].split('=').pop();

  searchApi(animalType, location);
}


//get details about a single animal type the user selected

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
         token_obj.access_token = data.token_type;
         token_obj.expires_in = data.expires_in;
         token_obj.token_type=data.token_type;
        return fetch(' https://api.petfinder.com/v2/animals?types='+ animalType+'&location='+location, {
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
                for(let j = 0;j <20 ;j++){

                   animalInfoArray[j] = new Array();
                   var id = data.animals[j].id;
                   var name = data.animals[j].name;
                   var gender=data.animals[j].gender;
                  var size =data.animals[j].size;
                  var age =data.animals[j].age;
                   animalInfoArray[j] = new Array(id,name,gender,size,age);

                    console.log(animalInfoArray);

                }
                createTable(animalInfoArray);

            }
    });
});
}

// creating a table with fetch response

function createTable(animalInfo){
$('#animalTable').DataTable({

data : animalInfo

});

}