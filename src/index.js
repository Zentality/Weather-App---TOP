async function getWeather(location) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=5486debd66620876ff108c5a748811d1`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      loadWeatherData(response);
    }).catch((err) => {
      console.log(err);
    })
}

function loadWeatherData(response) {
  console.log(response);
}

const form = document.querySelector("form");
const formInput = document.querySelector("#query");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeather(formInput.value);
})