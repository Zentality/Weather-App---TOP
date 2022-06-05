import './styles.css';
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
  let isFahrenheit = false;
  return { isFahrenheit }
})();

const element = (() => {
  const form = document.querySelector("form");
  const formInput = document.querySelector("#query");
  const city = document.querySelector(".city");
  const country = document.querySelector(".country");
  const temperatureNow = document.querySelector(".temperatureNow");
  const feelsLike = document.querySelector(".feelsLike");
  const forecastDateRange = document.querySelector(".forecastDateRange");
  const forecastWrapper = document.querySelector(".forecastWrapper");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeather(formInput.value);
    formInput.value = "";
  })

  document.onload = getWeather("Paris");

  return { city, country, temperatureNow, feelsLike, forecastDateRange, forecastWrapper }
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
  loadCurrentWeatherData(response.current.temp, response.current.feels_like);
  loadForecast(response.daily, response.timezone_offset);
}

function loadCurrentWeatherData(tempInK, feelsLikeInK) {
  element.temperatureNow.textContent = getTempFromK(config.isFahrenheit, tempInK);
  element.feelsLike.textContent = getTempFromK(config.isFahrenheit, feelsLikeInK);
}

function loadForecast(forecastData, timezoneOffset) {
  element.forecastWrapper.textContent = "";
  let startDate = "";
  let endDate = "";
  for (let i = 0; i < 8; i++) {
    const dateDetails = getDateFromUnixTime(forecastData[i].dt + timezoneOffset);
    if (i === 0) {
      startDate = `${dateDetails.month}, ${dateDetails.year}`
    } else if (i === 7) {
      endDate = `${dateDetails.month}, ${dateDetails.year}`
    }

    const forecastDay = document.createElement("div");

    const forecastDayOfWeek = document.createElement("div");
    forecastDayOfWeek.textContent = `${dateDetails.dayOfWeek} ${dateDetails.dayOfMonth}`;

    const forecastSymbol = document.createElement("div");
    const symbol = document.createElement("img");
    symbol.src = `http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}@2x.png`;
    symbol.alt = forecastData[i].weather[0].main;
    symbol.title = forecastData[i].weather[0].description;
    forecastSymbol.appendChild(symbol);

    const forecastTemps = document.createElement("div");
    forecastTemps.textContent = `${getTempFromK(config.isFahrenheit, forecastData[i].temp.max)}, ${getTempFromK(config.isFahrenheit, forecastData[i].temp.min)}`

    forecastDay.append(forecastDayOfWeek, forecastSymbol, forecastTemps);
    element.forecastWrapper.append(forecastDay);
  }
  if (startDate === endDate) {
    element.forecastDateRange.textContent = startDate;
  } else {
    element.forecastDateRange.textContent = `${startDate} - ${endDate}`;
  }
}

function getCountryFromCode(code) {
  const countryCodeObject = countryCodes.customList('countryCode', '{countryNameEn}');
  return countryCodeObject[code];
}

function getDateFromUnixTime(timestamp) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const date = new Date(timestamp * 1000);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = monthsOfYear[date.getMonth()];
  const dayOfMonth = getDayOfMonth();
  const year = date.getFullYear();
  function getDayOfMonth() {
    const day = String(date.getDate());
    const lastDigit = day.charAt(day.length - 1);
    if (day == 11 || day == 12 || day == 13) {
      return `${day}th`;
    } else if (lastDigit == 1) {
      return `${day}st`;
    } else if (lastDigit == 2) {
      return `${day}nd`;
    } else if (lastDigit == 3) {
      return `${day}rd`;
    } else {
      return `${day}th`;
    }
  }
  return { dayOfWeek, dayOfMonth, month, year };
}

function getTempFromK(isFahrenheit, kelvinValue) {
  const celcius = Number(kelvinValue) - 273.15;
  if (isFahrenheit) {
    return `${Math.floor(celcius * (9 / 5) + 32)}°f`;
  } else {
    return `${Math.floor(celcius)}°c`;
  }
}