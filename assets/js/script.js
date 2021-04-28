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
var cityContainer = document.getElementById('currentCity');
var cityButton = document.getElementById('btn-searchCity');

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


function renderCityHistory() {
  // Use JSON.parse() to convert text to JavaScript object
  var cityWeathers = JSON.parse(localStorage.getItem("cityHistory"));
  // Check if data is returned, if not exit out of the function
  if (lastGrade !== null) {

      // current


      // document.getElementById("saved-name").innerHTML = lastGrade.student;
      // document.getElementById("saved-grade").innerHTML = lastGrade.grade;
      // document.getElementById("saved-comment").innerHTML = lastGrade.comment;
  } else {
    return;
  }
}

function getWeather(city) {
    var cityName = city;
    var apiKey = "c812965f3b858aaacfcb1d520a8d9fa5";

    var requested_url ="http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid="+apiKey;
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    fetch(requested_url)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {

          var lon = data.coord.lon;
          var lat = data.coord.lat;

          var url_index =
          "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly&units=imperial&appid="+apiKey;
          fetch(url_index)
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

              // var userName = document.createElement('h3');
              // var userUrl = document.createElement('p');
              var city = document.getElementById("single-city");

              userName.textContent = data[i].login;
              userUrl.textContent = data[i].url;
              usersContainer.append(userName);
              usersContainer.append(userUrl);


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
}

getWeather("New York");

fetchButton.addEventListener('click', getWeather());