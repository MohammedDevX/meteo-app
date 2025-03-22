function showApi(position) {
    let xhr = new XMLHttpRequest();
    let xhrc = new XMLHttpRequest();
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    xhr.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&current=temperature_2m,apparent_temperature,is_day,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_hours');
    xhrc.open('GET', 'https://nominatim.openstreetmap.org/reverse?lat='+latitude+'&lon='+longitude+'&format=json');

    xhrc.onload = function() {
        let data = JSON.parse(xhrc.response);
        console.log(data);
        document.querySelector(".all .header div h2").innerHTML = data.address.city;
    }

    xhrc.onloadstart = function() {
        document.querySelector(".header").style.visibility = "hidden";
        document.querySelector(".cnt1").style.visibility = "hidden";
        document.querySelector(".text").style.visibility = "hidden";
        document.querySelector(".cnt2").style.visibility = "hidden";
        document.querySelector(".cnt3").style.visibility = "hidden";
        document.querySelector(".spinner-border").style.display = "block";
    }

    xhrc.onloadend = function() {
        document.querySelector(".header").style.visibility = "visible";
        document.querySelector(".cnt1").style.visibility = "visible";
        document.querySelector(".text").style.visibility = "visible";
        document.querySelector(".cnt2").style.visibility = "visible";
        document.querySelector(".cont3").style.visibility = "visible";
        document.querySelector(".spinner-border").style.display = "none";
    }

    xhrc.send();

    xhr.onload = function() {
        let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let data = JSON.parse(xhr.response);
        console.log(data);

        document.querySelector(".all .header div h1").innerHTML = Math.round(data.current.temperature_2m) + "°";
        document.querySelector(".all .text p span:last-child").innerHTML = Math.round(data.current.apparent_temperature) + "°";
        document.querySelector(".all .text p span:first-child").innerHTML = Math.round(data.daily.apparent_temperature_max[0]) + "°";
        document.querySelector(".all .text p .tmin").innerHTML = Math.round(data.daily.apparent_temperature_min[0]) + "°";

        updateTime();

        document.querySelector(".all .text p:nth-child(2) span:first-child").innerHTML = days[new Date().getDay()-1];

        let iconCode = weatherCode(data.current.weather_code);
        fetchWeatherIcon(iconCode);

        for (let i=0; i<8; i++) {
            let date = new Date(data.hourly.time[i]).getHours();
            if (date < 10) {
                date = '0'+date;
            }
            let iconCodeHourly = weatherCode(data.hourly.weather_code[i]);
            document.querySelector(".all .cnt1 .cnt-inside").innerHTML += `<div class='jm'><div class='time'><span>${date}:00</span></div> <div class='icon'><img src="${fetchWeatherIconHourly(iconCodeHourly)}" alt="weather-code" width="35px" ></div> <div class
            ='temp'>${Math.round(data.hourly.temperature_2m[i])}°</div> <div class="prob"><i class="fa-solid fa-droplet"></i> ${data.hourly.precipitation_probability[i]}%</div> </div>`;
        }

        for (let i=0; i<7; i++) {
            document.querySelector(".cnt2-inside .cin").innerHTML += `<div class="days">${days[i]}</div>`;
            document.querySelector(".cnt2-inside .cin1").innerHTML += `<div class="proba"><i class="fa-solid fa-droplet"></i>${Math.round(data.daily.precipitation_sum[i])}%</div>`;
            document.querySelector(".cnt2-inside .cin2").innerHTML += `<i class="fas fa-sun"></i>`;
            document.querySelector(".cnt2-inside .cin3").innerHTML += `<i class="fa-solid fa-moon"></i>`;
            document.querySelector(".cnt2-inside .cin4").innerHTML += `<div class="min">${data.daily.apparent_temperature_min[i]}°</div>` 
            document.querySelector(".cnt2-inside .cin5").innerHTML += `<div class="max">${data.daily.apparent_temperature_max[i]}°</div>` 
        }

        document.querySelector(".cont3 .cont-inside .sunrise").innerHTML = new Date(data.daily.sunrise[0]).getHours();
    }
    
    xhr.send();

    function updateTime() {
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (hours < 10) {
            hours = 0+"0";
        }
        document.querySelector(".all .text p:nth-child(2) span:last-child").innerHTML = hours + ":" + minutes;
    }

    setInterval(() => {
        updateTime();
    }, 1);

    function weatherCode(weather_code) {
        switch (weather_code) {
            case 0: return '01d';  // Ciel clair
            case 1: return '02d';  // Principalement dégagé
            case 2: return '03d';  // Partiellement nuageux
            case 3: return '04d';  // Couvert
    
            // Brouillard et conditions de visibilité réduite
            case 45: return '50d';
            case 48: return '50d';
    
            // Bruine
            case 51: return '09d';  // Bruine légère
            case 53: return '09d';  // Bruine modérée
            case 55: return '09d';  // Bruine forte
            case 56: return '10d';  // Bruine verglaçante légère
            case 57: return '10d';  // Bruine verglaçante forte
    
            // Pluie
            case 61: return '09d';  // Pluie légère
            case 63: return '10d';  // Pluie modérée
            case 65: return '11d';  // Pluie forte
            case 66: return '10d';  // Pluie verglaçante légère
            case 67: return '11d';  // Pluie verglaçante forte
    
            // Neige
            case 71: return '13d';  // Neige légère
            case 73: return '13d';  // Neige modérée
            case 75: return '13d';  // Neige forte
            case 77: return '13d';  // Grains de neige
    
            // Averses de pluie
            case 80: return '09d';  // Averses légères
            case 81: return '10d';  // Averses modérées
            case 82: return '11d';  // Averses fortes
    
            // Averses de neige
            case 85: return '13d';  // Averses de neige légères
            case 86: return '13d';  // Averses de neige fortes
    
            // Orages
            case 95: return '11d';  // Orage léger ou modéré
            case 96: return '11d';  // Orage avec grêle légère
            case 99: return '11d';  // Orage avec grêle forte
    
            default: return 'default'; 
        }
    }

    function fetchWeatherIcon(iconCode) {
        let iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
        let iconImage = document.querySelector(".all .header .weather-icon"); 

        if (iconImage) {
            iconImage.src = iconUrl; 
        } else {
            console.log('Weather icon element not found.');
        }
    }
}

function fetchWeatherIconHourly(code) {
    return 'http://openweathermap.org/img/wn/' + code + '.png';
}

function getLocation(callback) {
    navigator.geolocation.getCurrentPosition(callback);
}

getLocation(showApi);
