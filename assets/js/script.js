var formEl = $('#skills-form');
var nameInputEl = $('#skill-name');
var dateInputEl = $('#datepicker');
var skillsListEl = $('#skills-list');

var printSkills = function (name, date) {
  var listEl = $('<li>');
  var listDetail = name.concat(' on ', date);
  listEl.addClass('list-group-item').text(listDetail);
  listEl.appendTo(skillsListEl);
};

var handleFormSubmit = function (event) {
  event.preventDefault();

  var nameInput = nameInputEl.val();
  var dateInput = dateInputEl.val();

  if (!nameInput || !dateInput) {
    console.log('You need to fill out the form!');
    return;
  }

  printSkills(nameInput, dateInput);

  // resets form
  nameInputEl.val('');
  dateInputEl.val('');
};

// formEl.on('submit', handleFormSubmit);

/////////////////////////////////////////////////////////////////////////////////////////////////////

var cityWeather;
var usersContainer = document.getElementById('currentCity');
var fetchButton = document.getElementById('btn-searchCity');



function color_string(number) {
  if (number<=2) return "green";
  else if (number<=5) return "yellow";
  else if (number<=7) return "orange";
  else if (number<=10) return "red";
  return "violet";
}

function date_string(number){
  return moment.unix(number).format("M/D/YYYY");
}

var cityName = "New York";
var apiKey = "c812965f3b858aaacfcb1d520a8d9fa5";

var api ="http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid="+apiKey;
// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

fetch(api)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

    var lon = data.coord.lon;
    var lat = data.coord.lat;

    var api_index =
    "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly&units=imperial&appid="+apiKey;
    fetch(api_index)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var weatherList=[];
      var aTmp= date_string(data.current.dt);
      cityWeather={
         date: aTmp,
         temp: data.current.temp,
         wind_speed: data.current.wind_speed,
         icon : data.current.weather[0].icon,
         humidity: data.current.humidity,
         uvi: data.current.uvi,
      };

      weatherList.push(cityWeather);

      for(var i=1; i<6; i++){
        aTmp = date_string(data.daily[i].dt);
        cityWeather ={
                date: aTmp,
                temp: data.daily[i].temp.min,
                wind_speed: data.daily[i].wind_speed,
                icon : data.daily[i].weather[0].icon,
                humidity: data.daily[i].humidity,
                uvi: data.daily[i].uvi
         };
         weatherList.push(cityWeather);
      }




    });


});

