async function getWeatherInfo(location) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=5486debd66620876ff108c5a748811d1`, { mode: 'cors' })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
    })
}
