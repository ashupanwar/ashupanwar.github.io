//api key b32a5fe9be074e79a77105631220908


const expandDetails = document.querySelector('.expand-details');
const expandBTN = document.querySelector('.expand-btn');

//Current weather
const weatherContainer = document.querySelector('.weather-container');
const currentTemp = document.querySelector('.degree-value');
const cityName = document.querySelector('.city');
const currentCityDateTime = document.querySelector('.date-time');
const currentWeatherIcon = document.querySelector('.icon-img');
const currentWeatherTitle = document.querySelector('.desc');
const favBTN = document.querySelector('.fav-btn');
const favIcon = document.querySelector('.fav-btn > i');
const currentWeather = document.querySelector('.current-weather');

//Forecast Weather
const forecastContainer = document.querySelector('.forecast');

//Detail Section
const hum = document.querySelector('.humidity-value');
const win = document.querySelector('.windspeed-value');
const con = document.querySelector('.condition-value');
const vis = document.querySelector('.visibility-value');
const pre = document.querySelector('.precipitation-value');

//Astro Section
const sunrise = document.querySelector('.sunrise-value');
const sunset = document.querySelector('.sunset-value');
const moonrise = document.querySelector('.moonrise-value');
const moonset = document.querySelector('.moonset-value');
const moonphase = document.querySelector('.moonphase-value');

//Chance of Rain
const chanceRain = document.querySelector('.rain-value');

//Search
const search = document.querySelector('.search');
const suggestionList = document.querySelector('.suggestions-list');

//Favourites
const favouritesList = document.querySelector('.fav-ul');

//Background
const background = document.querySelector('.background');

//menu button
const menuBTN = document.querySelector('.menu-btn');
const panel = document.querySelector('.panel');
const closeBTN = document.querySelector('.fa-arrow-right');



const apiKey = "b32a5fe9be074e79a77105631220908";
let selectedCity = 'New York';



//Event Listeners-----------------------------------------------------

expandBTN.addEventListener('click', () => {
    expandDetails.classList.toggle('expanded');
    if (expandBTN.innerText == 'Show more') {
        expandBTN.innerText = 'Show less';
    } else {
        expandBTN.innerText = 'Show more';
    }
})

search.addEventListener('keyup', showSuggestions);

weatherContainer.addEventListener('click', hideSuggestions);

favBTN.addEventListener('click', toggleAddToFavorite);

menuBTN.addEventListener('click', toggleMenu);

closeBTN.addEventListener('click', toggleMenu);

firstLoad();




//Functions-----------------------------------------------------------

function toggleMenu() {
    panel.classList.toggle('panel-toggle');
}

function setBackground(data) {
    let timeOfDay = "day";

    const code = data.current.condition.code;

    if (!data.current.is_day) {
        timeOfDay = "night";
    }

    if (code == 1000) {
        background.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
    }
    else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
    ) {
        background.style.backgroundImage = `
                url(./images/${timeOfDay}/cloud.jpg)`;
    }
    else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252

    ) {
        background.style.backgroundImage = `
                url(./images/${timeOfDay}/rain.jpg)`;

    }
    else {
        background.style.backgroundImage = `url(./images/${timeOfDay}/snow.jpg)`;
    }
}

function setForecastBackground(timeOfDay, code, background) {

    if (code == 1000) {
        background.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
    }
    else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
    ) {
        background.style.backgroundImage = `
                url(./images/${timeOfDay}/cloud.jpg)`;
    }
    else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252

    ) {
        background.style.backgroundImage = `
                url(./images/${timeOfDay}/rain.jpg)`;

    }
    else {
        background.style.backgroundImage = `url(./images/${timeOfDay}/snow.jpg)`;
    }
}

function firstLoad() {
    let favList = JSON.parse(localStorage.getItem('favList'));
    if (favList == null) {
        selectedCity = "New York";
    } else {
        selectedCity = favList[0];
    }
    updateWeather();
}

function toggleAddToFavorite() {

    const isFav = this.dataset.isFav;
    if (isFav === 'no') {
        this.dataset.isFav = 'yes';
        let favList = JSON.parse(localStorage.getItem('favList'));
        if (favList == null) favList = [];
        favList.push(selectedCity);
        localStorage.setItem('favList', JSON.stringify(favList));

        favIcon.className = 'fa fa-solid fa-heart'

        loadFavourites();
    }
    else {
        this.dataset.isFav = 'no';
        let favList = JSON.parse(localStorage.getItem('favList'));
        const index = favList.indexOf(selectedCity);
        if (index > -1) {
            favList.splice(index, 1);
        }
        localStorage.setItem('favList', JSON.stringify(favList));
        favIcon.className = 'fa fa-regular fa-heart'

        loadFavourites();
    }
}

function showSuggestions() {

    suggestionList.innerHTML = '';
    suggestionList.style.maxHeight = '0px';

    let input = this.value;
    if (input.length <= 2) return;
    fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${input}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(city => {
                let li = document.createElement('li');
                li.className = 'sug';
                li.innerText = city.name;

                li.addEventListener('click', () => {
                    background.style.opacity = 0;
                    currentWeather.style.opacity = 0;
                    expandDetails.style.opacity = 0;
                    expandBTN.style.opacity = 0;
                    selectedCity = city.name;
                    search.value = '';
                    suggestionList.innerHTML = '';

                    if (menuBTN.style.display !== 'none') {
                        panel.classList.toggle('panel-toggle');
                    }

                    updateWeather();
                })

                suggestionList.append(li);
            });
        })
    suggestionList.style.maxHeight = '520px';
}

function hideSuggestions() {
    suggestionList.innerHTML = "";
}

function updateWeather() {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${selectedCity}&days=6&aqi=no&alerts=no`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setBackground(data);
            setCurrentWeatherInfo(data);
            loadFavButton();
            loadFavourites();
            setForecastInfo(data);
            setDetails(data);
            setAstro(data);
            setChanceOfRain(data);
            background.style.opacity = 0.95;
            currentWeather.style.opacity = 1;
            expandDetails.style.opacity = 1;
            expandBTN.style.opacity = 1;
        });
}

function loadFavourites() {

    favouritesList.innerHTML = '';

    let favList = JSON.parse(localStorage.getItem('favList'));
    if (favList == null) {
        favList = [];
    } else {
        favList.forEach(item => {

            let li = document.createElement('li');
            li.className = 'fav-item';
            li.innerHTML = item;

            li.addEventListener('click', () => {
                selectedCity = item;
                background.style.opacity = 0;
                currentWeather.style.opacity = 0;
                expandDetails.style.opacity = 0;
                expandBTN.style.opacity = 0;

                if (menuBTN.style.display !== 'none') {
                    panel.classList.toggle('panel-toggle');
                }

                updateWeather();
            })

            favouritesList.appendChild(li);
        })
    }
}

function loadFavButton() {
    let isInFav = false;

    let favList = JSON.parse(localStorage.getItem('favList'));
    if (favList == null) {
        isInFav = false;
    }
    else {
        const index = favList.indexOf(selectedCity);
        if (index > -1) {
            isInFav = true;
        }
    }

    if (isInFav) {
        favIcon.className = 'fa fa-solid fa-heart'
        favBTN.dataset.isFav = 'yes';
    } else {
        favIcon.className = 'fa fa-regular fa-heart'
        favBTN.dataset.isFav = 'no';
    }

}

function setCurrentWeatherInfo(data) {
    currentTemp.innerHTML = Math.floor(data.current.temp_c);
    cityName.innerHTML = data.location.name;
    currentCityDateTime.innerHTML = getDataTime(data.location.localtime);
    currentWeatherIcon.src = setCurrentWeatherIcon(data.current.condition.icon);
    currentWeatherTitle.innerHTML = data.current.condition.text;
}

function setForecastInfo(data) {
    let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ]

    forecastContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const date = new Date(data.forecast.forecastday[i].date);
        let iconURL = data.forecast.forecastday[i].day.condition.icon;
        let iconTitle = setCurrentWeatherIcon(iconURL);
        let maxTemp = Math.floor(data.forecast.forecastday[i].day.maxtemp_c);
        let minTemp = Math.floor(data.forecast.forecastday[i].day.mintemp_c);


        forecastContainer.innerHTML += (`
                <div class="day day-${i + 1}">
                    <div class="day-name">
                        <h2>${days[date.getDay()]}</h2>
                    </div>
                    <div class="temp-details">
                        <img src="${iconTitle}" alt="icon">
                        <h3 class="max-temp">${maxTemp}&#8451</h3>
                        <h4 class="min-temp">${minTemp}&#8451</h4>
                    </div>
                </div>
        `)

        const background = document.querySelector(`.day-${i + 1}`);
        let isDay = "day";
        let code = data.forecast.forecastday[i].day.condition.code;
        setForecastBackground(isDay, code, background);

    }
}

function setDetails(data) {
    let humidity = data.current.humidity;
    let windspeed = data.current.wind_kph;
    let condition = data.current.condition.text;
    let visibility = data.current.vis_km;
    let precipitation = data.current.precip_mm;

    hum.innerHTML = humidity + '%';
    win.innerHTML = windspeed + ' kmph';
    con.innerHTML = condition;
    vis.innerHTML = visibility + ' km';
    pre.innerHTML = precipitation + ' mm';
}

function setAstro(data) {
    sunrise.innerHTML = data.forecast.forecastday[0].astro.sunrise;
    sunset.innerHTML = data.forecast.forecastday[0].astro.sunset;
    moonrise.innerHTML = data.forecast.forecastday[0].astro.moonrise;
    moonset.innerHTML = data.forecast.forecastday[0].astro.moonset;
    moonphase.innerHTML = data.forecast.forecastday[0].astro.moon_phase;
}

function setChanceOfRain(data) {
    chanceRain.innerHTML = data.forecast.forecastday[0].day.daily_chance_of_rain + "%";
}

function getDataTime(text) {

    let monthName = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    let time = text.split(' ')[1];
    let day = text.split('-')[2].split(' ')[0];
    let month = text.split('-')[1];
    let year = text.split('-')[0];

    return `${time} ${day}-${monthName[(+month) - 1]}-${year}`;
}

function setCurrentWeatherIcon(url) {
    let iconFileName = url.split('/')[5] + '/' + url.split('/')[6];
    return `./icons/${iconFileName}`;
}