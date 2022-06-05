const countryCodes = require('country-codes-list');

async function getWeather(location) {
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=5486debd66620876ff108c5a748811d1`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      loadWeatherLocation(response);
    }).catch((err) => {
      console.log(err);
    })
}

const config = (() => {
  let isFahrenheit = true;
  return { isFahrenheit }
})();

const element = (() => {
  const form = document.querySelector("form");
  const formInput = document.querySelector("#query");
  const city = document.querySelector(".city");
  const country = document.querySelector(".country");
  const temperatureNow = document.querySelector(".temperatureNow");
  const feelsLike = document.querySelector(".feelsLike");
  const forecastDays = document.querySelectorAll(".dayOfWeek");
  const forecastSymbols = document.querySelectorAll(".weatherSymbol");
  const forecastTemps = document.querySelectorAll(".tempRange");
  const forecastDateRange = document.querySelector(".forecastDateRange");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeather(formInput.value);
    formInput.value = "";
  })

  return { city, country, temperatureNow, feelsLike, forecastDays, forecastSymbols, forecastTemps }
})();

async function loadWeatherLocation(response) {
  element.city.textContent = `${response[0].name}, `;
  element.country.textContent = getCountryFromCode(response[0].country);

  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${response[0].lat}&lon=${response[0].lon}&exclude=minutely,hourly,alerts&appid=5486debd66620876ff108c5a748811d1`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      loadWeatherData(response);
    }).catch((err) => {
      console.log(err);
    })
}

function loadWeatherData(response) {
  console.log(response)
  loadCurrentWeatherData(response.current.temp, response.current.feels_like);
  loadForecast(response.daily, response.timezone_offset);
}

function loadCurrentWeatherData(tempInK, feelsLikeInK) {
  element.temperatureNow.textContent = getTempFromK(config.isFahrenheit, tempInK);
  element.feelsLike.textContent = getTempFromK(config.isFahrenheit, feelsLikeInK);
}

function loadForecast(forecastData, timezoneOffset) {
  console.log(forecastData);
  console.log(timezoneOffset);
  for (let i = 0; i < 8; i++) {
    element.forecastDays[i].textContent = getDateFromUnixTime(forecastData[i].dt + timezoneOffset);
  }
}

function getCountryFromCode(code) {
  const countryCodeObject = countryCodes.customList('countryCode', '{countryNameEn}');
  return countryCodeObject[code];
}

function getDateFromUnixTime(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp * 1000);
  const dayOfWeek = convertIndexToDay()
  function convertIndexToDay() {
    switch (date.getDay()) {
      case 0: return "Sunday";
      case 1: return "Monday";
      case 2: return "Tuesday";
      case 3: return "Wednesday";
      case 4: return "Thursday";
      case 5: return "Friday";
      case 6: return "Saturday";
    }
  }
  return (`${dayOfWeek}`)
}

function getTempFromK(isFahrenheit, kelvinValue) {
  const celcius = Number(kelvinValue) - 273.15;
  if (isFahrenheit) {
    return Math.floor(celcius * (9 / 5) + 32);
  } else {
    return Math.floor(celcius);
  }
}