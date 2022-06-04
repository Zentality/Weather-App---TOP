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

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeather(formInput.value);
    formInput.value = "";
  })

  return { city, country, temperatureNow, feelsLike }
})();

async function loadWeatherLocation(response) {
  console.log(response);

  element.city.textContent = `${response[0].name}, `;
  element.country.textContent = getCountryFromCode(response[0].country);

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${response[0].lat}&lon=${response[0].lon}&appid=5486debd66620876ff108c5a748811d1`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      loadCurrentWeatherData(response);
    }).catch((err) => {
      console.log(err);
    })
}

function loadCurrentWeatherData(response) {
  console.log(response);
  element.temperatureNow.textContent = getTempFromK(config.isFahrenheit, response.main.temp);
  element.feelsLike.textContent = getTempFromK(config.isFahrenheit, response.main.feels_like);
}

function getCountryFromCode(code) {
  const countryCodeObject = countryCodes.customList('countryCode', '{countryNameEn}');
  return countryCodeObject[code];
}

function getTempFromK(isFahrenheit, kelvinValue) {
  const celcius = Number(kelvinValue) - 273.15;
  if (isFahrenheit) {
    return Math.floor(celcius * (9 / 5) + 32);
  } else {
    return Math.floor(celcius);
  }
}