/////////////////////////////////////////////////////////////////////////////////////////////////////

var cityWeather;
var cityContainer = document.getElementById('currentCity');
var cityButton = document.getElementById('btn-searchCity');

var daysList = document.getElementById('5days');
var cityList = document.getElementById('cities');
var cityForm = document.querySelector("#city-form");
var cityInput = document.querySelector("#city-name");

var isCity= false;

var cities = [];

// The following function renders items in a todo list as <li> elements
function renderCities() {
  // Clear todoList element and update todoCountSpan
  cityList.innerHTML = "";
//  <button type="button" value="Austin" class="btn-sm custom-button">Austin</button> 
   
    // Render a new li for each city
  for (var i = 0; i < cities.length; i++) {
    var cityN = cities[i];

    var boton = document.createElement("button");
    boton.textContent = cityN;
    boton.setAttribute("type", "button");
    boton.setAttribute("value", cityN);
    boton.setAttribute("class", "btn-sm custom-button");
    boton.setAttribute("id", "btn-city");
    boton.setAttribute("data-index", i);
    cityList.appendChild(boton);
  }
}


// This function is being called below and will run when the page loads.
function init() {
  // Get stored todos from localStorage
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  // If todos were retrieved from localStorage, update the todos array to it
  if (storedCities !== null) {
    cities = storedCities;
  }

  // This is a helper function that will render todos to the DOM
  getWeather("New York");
  renderCities();
}


function storeCities() {
  // Stringify and set key in localStorage to todos array
  localStorage.setItem("cities", JSON.stringify(cities));
}


function color_string(number) {
  if (number<=2.0) return "green";
  else if (number<=5.0) return "yellow";
  else if (number<=7.0) return "orange";
  else if (number<=10.0) return "red";
  return "violet";
}

function date_string(number){
  return moment.unix(number).format("M/D/YYYY");
}


cityForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var cityText = cityInput.value.trim();

  // Return from function early if submitted todoText is blank
  if (cityText === "") {
    return;
  }
  else if (!cities.includes(cityText))
      cities.push(cityText);


  // Add new todoText to todos array, clear the input
  
  cityInput.value = "";

  // Store updated todos in localStorage, re-render the list
  getWeather(cityText);
  if (isCity) { 
    storeCities();
    renderCities();
  }
});

cityList.addEventListener("click", function(event) {
  event.preventDefault();

  var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {

    // Get its data-index value and remove the todo element from the list
    // var index = element.parentElement.getAttribute("data-index");
    var cTmp = element.textContent;

  // Store updated todos in localStorage, re-render the list
    getWeather(cTmp);
  }

});

function getWeather(city) {
 
    daysList.innerHTML = "";
    var cityName = city;
    var apiKey = "c812965f3b858aaacfcb1d520a8d9fa5";

    var requested_url ="http://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid="+apiKey;
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

    fetch(requested_url)
              .then(function (response) {
                if (response.ok) { 
                  
                  response.json().then(function (data) {
                          if (data!=null) {
                            isCity = true;
                         
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
                              uvi: data.daily[0].uvi,
                            };

                            weatherList.push(cityWeather);

                            document.querySelector("#single-city").textContent = city+" ("+cityWeather.date+")";
                            document.querySelector("#single-temp").textContent = cityWeather.temp;
                            document.querySelector("#single-wind").textContent = cityWeather.wind_speed;
                            document.querySelector("#single-humidity").textContent = cityWeather.humidity;
                            document.querySelector("#single-uvindex").textContent = cityWeather.uvi;
                            var colorTmp = "background-color:"+color_string(cityWeather.uvi);
                            document.querySelector("#single-uvindex").setAttribute("style",colorTmp);

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

                              var div = document.createElement("div");
                              div.setAttribute("class","col custom-weather-sm");

                              var p = document.createElement("p");
                              p.textContent = cityWeather.date;
                              div.appendChild(p);

                              var img = document.createElement("img");
                              var tmp = "http://openweathermap.org/img/wn/"+cityWeather.icon+".png"
                              img.setAttribute("src",tmp);
                              div.appendChild(img);

                              p = document.createElement("p");
                              p.textContent = "Temp: "+cityWeather.temp+" °F";
                              div.appendChild(p);

                              p = document.createElement("p");
                              p.textContent = "Wind: "+cityWeather.wind_speed+" MPH";
                              div.appendChild(p);

                              p = document.createElement("p");
                              p.textContent = "Humidity: "+cityWeather.humidity+" %";
                              div.appendChild(p);

                              daysList.appendChild(div);

                              // <div class="col custom-weather-sm">
                              //   <p>3/31/2021</p>
                              //   <img src="http://openweathermap.org/img/wn/10d.png" alt="weather"/>
                              //   <p>Temp:</p>
                              //   <p>Wind</p>
                              //   <p>Humidity</p>
                              // </div>
                            }
                          });
                        }
                    });
                  }
                  else {
                    isCity = false;
                   
                  }   
            })
            .catch(function(error) {

              console.log(error);
            
         });

}

// getWeather("New York");

// fetchButton.addEventListener('click', getWeather());

init();
