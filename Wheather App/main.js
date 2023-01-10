
// Api Key for our Weather API
const Api_Key = "d6a51e4e2f0e56cbfd15ee02e35f5b91"; // Current Weather API key 
//WeekDays to display on Day wise
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"]

let selectedCityText;
let selectedCity;


// Getting current weather data

const getCurrentWeatherData = async function ({ lat, lon, name: city }) {
    const url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${Api_Key}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_Key}&units=metric`

    let response = await fetch(url);
    return response.json();
}

//getting hourly data 

const getHourlyData = async function ({ name: city }) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${Api_Key}&units=metric`);
    let data = await response.json();

    return data.list.map(fore => {
        const { main: { temp, temp_max, temp_min }, dt, dt_txt, weather: [{ description, icon }], } = fore;
        return { temp, temp_max, temp_min, dt, dt_txt, description, icon }
    })
}



//Loading cities
const gettingCities = async (searchText) => {

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchText}&limit=5&appid=${Api_Key}`)
    return response.json()

}




// Function to format temperature 
const formatTemperature = function (str) {
    formatedTemp = `${str?.toFixed(1)}°`
    return formatedTemp

}

const getIcon = function (icon) {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`

}
//Loading current data to the Page

const loadCurrentData = ({ weather: [{ description, icon }], name, main: { temp, temp_max, temp_min } }) => {
    const currentForecast = document.querySelector("#current-forecast")
    currentForecast.querySelector("#city").textContent = name;
    currentForecast.querySelector("#temp").textContent = temp;
    currentForecast.querySelector("#des").textContent = description;
    currentForecast.querySelector("#hl").textContent = `High-${formatTemperature(temp_max)} Low-${formatTemperature(temp_min)}`
};




const loadHourlyData = function ({ main: { temp: tempNow }, weather: [{ icon: iconNow }] }, hourlyForecast) {
    let dataFor12Hours = hourlyForecast.slice(1, 13);
    const timeFormatter = Intl.DateTimeFormat("en", { hour12: true, hour: "2-digit" })

    const hourlyFor = document.querySelector(".hourly-container");
    let innerHTMLString = `<section class="innerHourly">
    <h2 class="now">Now</h2>
    <img class="icon" src="${getIcon(iconNow)}" alt="">
    <h4 class="temp">${formatTemperature(tempNow)}</h4>
</section>`;


    for (let { temp, icon, dt_txt } of dataFor12Hours.slice(2, 14)) {
        innerHTMLString += `<section class="innerHourly">
        <h2 class="now" >${timeFormatter.format(new Date(dt_txt))}</h2>
        <img class="icon" src="${getIcon(icon)}" alt="">
        <h4 class="temp">${formatTemperature(temp)}</h4>
    </section>`
    }
    hourlyFor.innerHTML = innerHTMLString;

};






const loadFeelsLike_Humidity = function ({ main: { feels_like, humidity } }) {
    const feelsLikeArea = document.querySelector("#feels-like");
    const humidityArea = document.querySelector("#humidity");
    feelsLikeArea.querySelector(".feels-like-temp").textContent = formatTemperature(feels_like);
    humidityArea.querySelector(".humidity-value").textContent = `${humidity}%`

}

const calculateDayWise = function (hourlyFore) {
    let dayWise = new Map();
    for (let forecast of hourlyFore) {
        const date = forecast.dt_txt.split(" ")[0];
        const day = daysOfWeek[new Date(date).getDay()]

        if (dayWise.has(day)) {
            let forecastForDay = dayWise.get(day);
            forecastForDay.push(forecast)
            dayWise.set(day, forecastForDay)
        } else {
            dayWise.set(day, [forecast])
        }
    }
    for (let [key, value] of dayWise.entries()) {
        let temp_min = Math.min(...Array.from(value, val => val.temp_min))
        let temp_max = Math.max(...Array.from(value, val => val.temp_max))
        dayWise.set(key, { temp_min, temp_max, icon: value.find(v => v.icon).icon });
    }
    return dayWise;
}




const loadFiveDaysForecast = function (hourlyData) {

    const dayWiseForecast = calculateDayWise(hourlyData);
    const container = document.querySelector(".five-forecast");
    let dayWiseInfo = "";


    Array.from(dayWiseForecast).map(([day, { temp_min, temp_max, icon }], index) => {
        dayWiseInfo += `
        <article class="day-wise">

        <h2 class="data">${index == 0 ? "TODAY" : day}</h2>
        <img src=${getIcon(icon)} alt="" class="icon">
        <h4 class="low">${formatTemperature(temp_min)}</h4>
        <h4 class="high">${formatTemperature(temp_max)}</h4>

        </article>`}

    )

    container.innerHTML = dayWiseInfo;


}


const loadData = async () => {



    const currentWeather = await getCurrentWeatherData(selectedCity);
    loadCurrentData(currentWeather);

    const hourlyData = await getHourlyData(currentWeather);

    loadHourlyData(currentWeather, hourlyData)
    loadFeelsLike_Humidity(currentWeather)
    loadFiveDaysForecast(hourlyData)



}

const loadForecastUsingGeolocation = function () {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
        
        const { latitude, longitude} = coords;
        selectedCity = { lat:latitude,lon:longitude };
        
        loadData()


    }, error => console.log(error))
}




function debounce(func) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);

        }, 200)
    }
}

async function loadOnInputChange(event) {
    let { value } = event.target;
    if (!value) {
        selectedCity = null;
        selectedCityText = "";
    }


    if (value && (selectedCity !== value)) {
        const citiesList = await gettingCities(value);
        let options = "";
        for (let { lat, lon, name, state, country } of citiesList) {
            options += `<option data-city='${JSON.stringify({ lat, lon, name })}' value="${name},${state},${country}"></option>`

        }
        document.querySelector("#cities").innerHTML = options;
    }
}


const handleCitySelected = (event) => {
    selectedCityText = event.target.value;
    let options = document.querySelectorAll("#cities > option");
    if (options?.length) {
        
        let selectedOption = Array.from(options).find(opt => opt.value === selectedCityText);
        console.log(selectedOption)
        selectedCity = JSON.parse(selectedOption.getAttribute("data-city"));
        
        loadData();

    }


}


const debounceSearch = debounce((event) => loadOnInputChange(event));

document.addEventListener("DOMContentLoaded", async () => {
    loadForecastUsingGeolocation();
    const searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", debounceSearch)
    searchInput.addEventListener("change", handleCitySelected)

})