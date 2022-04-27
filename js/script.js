const cityInputEl = document.querySelector('#city-input');
const cityBtnEl = document.querySelector('#city-btn');
const searchHistoryEl = document.querySelector('#search-history')

const cityNameEl = document.querySelector('#city-name');
const cityTempEl = document.querySelector('#city-temperature');
const cityWindEl = document.querySelector('#city-wind');
const cityHumidityEl = document.querySelector('#city-humidity');
const cityUVEl = document.querySelector('#city-UV');

const cardContainer = document.querySelector('#cards-container');
let city;
let cities;
let cnt = 5;
const APIKey = '041b3ebaa9404accfbb12b62ccab9afb';

const refreshHistory = () => {
    searchHistoryEl.innerHTML = "";
    cities = JSON.parse(localStorage.getItem('Cities')) ?? "";
    
    for (let i = cities.length - 1; i >= 0; i--) {
        let newBtn = document.createElement('button')
        newBtn.classList.add("p-2", "text-white", "bg-gray-500", "rounded-full", "hover:bg-rose-600");
        newBtn.innerHTML = cities[i];
        newBtn.addEventListener('click', getDataHistory);
        searchHistoryEl.append(newBtn);
    }
}

const getData = (event) => {
    event.preventDefault();

    if (!cities) {
        cities = [];
    }

    city = cityInputEl.value;

    if (city === "") {
        return;
    }

    if (cities.includes(city)) {
        cities.push(cities.splice(cities.indexOf(city), 1)[0]);
    } else {
        cities.push(city);   
    }

    localStorage.setItem('Cities', JSON.stringify(cities));
    refreshHistory();
    openWeatherCurrent();
}

const getDataHistory = (event) => {
    event.preventDefault();

    city = event.target.innerText;

    openWeatherCurrent();
}
const openWeatherCurrent = async () => {

    const queryURLCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
    const response = await fetch(queryURLCurrent);
    const data = await response.json();

    let currentDate = data.dt

    currentDate = currentDate * 1_000;

    currentDate = new Date(currentDate);
 
    currentYear = currentDate.getFullYear();

    currentMonth = currentDate.getMonth() + 1; 

    currentDay = currentDate.getDate();

    currentDate = `(${currentDay}/${currentMonth}/${currentYear})`

    let cityWeatherIconCode = data.weather[0].icon;

    let cityWeatherIconURL = `https://openweathermap.org/img/w/${cityWeatherIconCode}.png`;

    cityNameEl.innerHTML = `${data.name} ${currentDate} <img src=${cityWeatherIconURL} class="inline" />`;
    cityTempEl.innerHTML = `Temperature: ${data.main.temp} °C`;
    cityWindEl.innerHTML = `Wind: ${data.wind.speed} m/s`;
    cityHumidityEl.innerHTML = `Humidity: ${data.main.humidity}%`;

    let backgroundColorUVI;
    if (data.current.uvi <= 2) {
        backgroundColorUVI = 'bg-green-500'
    } else if (data.current.uvi <= 5) {
        backgroundColorUVI = 'bg-yellow-500'
    } else {
        backgroundColorUVI = 'bg-red-500'
    }

    openWeatherOpenCall(data);
}

    const openWeatherOpenCall = async (currentData) => {
    const queryURLOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${APIKey}&units=metric`
    const response = await fetch(queryURLOneCall);
    const data = await response.json();

    cityUVEl.innerHTML = `UV Index: <span class="text-white ${backgroundColorUVI} ml-1 py-1 px-5 rounded">${data.current.uvi}</span>`

    for (let i = 1; i < 6; i++) {

        let forecastDate = data.daily[i].dt

        forecastDate = forecastDate * 1_000;

        forecastDate = new Date(forecastDate);
   
        forecastYear = forecastDate.getFullYear();
 
        forecastMonth = forecastDate.getMonth() + 1; 

        forecastDay = forecastDate.getDate();

        forecastDate = `${forecastDay}/${forecastMonth}/${forecastYear}`

        let forecastWeatherIconCode = data.daily[i].weather[0].icon;

        let forecastWeatherIconURL = `https://openweathermap.org/img/w/${forecastWeatherIconCode}.png`;

        cardContainer.children[i-1].children[0].innerHTML = forecastDate;
        cardContainer.children[i-1].children[1].innerHTML = `<img src=${forecastWeatherIconURL} class="inline" />`;
        cardContainer.children[i-1].children[2].innerHTML = `Temperature: ${data.daily[i].temp.day} °C`;
        cardContainer.children[i-1].children[3].innerHTML = `Wind: ${data.daily[i].wind_speed} m/s`;
        cardContainer.children[i-1].children[4].innerHTML = `Humidity: ${data.daily[i].humidity}%`;
    }
}

refreshHistory();
cityBtnEl.addEventListener('click', getData)