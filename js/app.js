console.info("Weather app - made by PanyGolf");

const temperatureNow = document.querySelector(".weather__city__temperature");

function getLat (location){
    const latitude = location.coords.latitude;
    return latitude
}
function getLong (location){
    const longitude = location.coords.longitude;
    return longitude
}


async function getWeatherData() {
    try{
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const latitude = getLat(position);
        const longitude = getLong(position);
        const api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,snowfall&hourly=temperature_2m&forecast_days=1`;
        const weather = await axios.get(api);
        const city = document.querySelector(".weather__city h1");
        async function cityName(){
            const api = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=0c63d40384b0fd2cf9eb689150d5fbdf`;
            try{
                const citynm = await axios.get(api);
                city.innerText = citynm.data[0].name;
            }
            catch (e){
                console.error(e.message);
            }
        }
        await getTime(latitude, longitude);
        await cityName();
        if (weather.data.current.is_day){
            document.querySelector('.weather').style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2FCqOvBFE.jpg&f=1&nofb=1&ipt=5f73cba553806e72b7ab4885f5e3401539a9fe4d351f57a126cac65b206a03c9&ipo=images")';
        }else if(!weather.data.current.is_day){
            document.querySelector('.weather').style.backgroundImage = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url("https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?cs=srgb&dl=pexels-francesco-ungaro-998641.jpg&fm=jpg")';

        }
        if(weather.data.current.rain === 0 && weather.data.current.snowfall === 0){
            const sun = document.createElement("img");
            sun.src = "https://static-00.iconduck.com/assets.00/sun-symbol-emoji-2048x2048-wityey4r.png";
            sun.style.height = "30px";
            sun.style.position = "absolute";
            sun.style.top = "61%";
            sun.style.left = "-6%";
            document.querySelector(".weather__city").append(sun);
        }else if(weather.data.current.rain === 1 && weather.data.current.snowfall === 0){
            const rain = document.createElement("img");
            rain.src = "https://cdn-icons-png.freepik.com/512/4150/4150897.png";
            rain.style.height = "30px";
            document.querySelector(".weather__city").append(rain);
        }else if(weather.data.current.rain === 0 && weather.data.current.snowfall === 1){
            const snowfall = document.createElement("img");
            snowfall.src = "https://cdn-icons-png.freepik.com/512/6221/6221304.png";
            snowfall.style.height = "30px";
            document.querySelector(".weather__city").append(snowfall);
        }
        temperatureNow.innerText = Math.round(weather.data.current.temperature_2m) + "°C";

    }catch(e){
        console.log(e.message);
    }
    finally {
        document.querySelector(".weather__search").style.display = "flex";
    }
}

getWeatherData();

async function getTime(lat, long){
    try{
        const api1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day,rain,snowfall&hourly=temperature_2m&forecast_days=1`;
        const weather = await axios.get(api1);
        const time1 = document.querySelector("#time1")
        time1.innerText = "";
        const api2 = `http://api.timezonedb.com/v2.1/get-time-zone?key=TVELJW0040YA&format=json&by=position&lat=${lat}&lng=${long}`;
        const time = await axios.get(api2);
        const timeArr = await weather.data.hourly.time
        const tempArr = await weather.data.hourly.temperature_2m;
        await console.log(timeArr)
        const curTime = time.data.formatted;
        let tempTime = curTime.split("")[11] + curTime.split("")[12];
        time1.innerText = tempTime;
        document.querySelector(".temp1").innerText = `${await weather.data.current.temperature_2m}°C`;
        for(let i = 1; i < 8; ++i){
            const index = Number(tempTime) + i;
            let timeText = timeArr[index][11] + timeArr[index][12];
            let timeTemp = tempArr[index];
            document.querySelector(`.temp${i+1}`).innerText = `${timeTemp}°C`;
            if(timeText === "23"){
                const timeElement = `time${i + 2}`;
                document.getElementById(timeElement).innerText = "00";
                const dump = `time${i + 1}`;
                document.getElementById(dump).innerText = timeText;
            }
            // }else if(timeText === "00"){
            //     const timeElement = `time${i + 1}`;
            //     document.getElementById(timeElement).innerText = timeArr[1][11] + timeArr[1][12];
            // }
            else{
                const timeElement = `time${i + 1}`;
                document.getElementById(timeElement).innerText = timeText;
            }
        }
    }
    catch (e) {
        console.error(e.message);
    }
}




const submit = document.querySelector(".weather__search__submit");
submit.addEventListener("click", searchCity);
document.querySelector(".weather__search__input").addEventListener("keyup", (k) => {
    if(k.key === "Enter"){
        searchCity();
    }
})

async function searchCity(){
    const input = document.querySelector(".weather__search__input");
    const city = input.value;
    const api = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=0c63d40384b0fd2cf9eb689150d5fbdf`;
    try{
        input.style.borderColor = "darkslateblue";
        const result = await axios.get(api)
        const lat = result.data[0].lat;
        const long = result.data[0].lon;
        document.querySelector(".weather__city h1").innerText = result.data[0].name;
        await getTime(lat, long);
        try{
            const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day,rain,snowfall,wind_speed_10m&hourly=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
            const result = await axios.get(api);
            document.querySelector(".weather__city__temperature").innerText = `${Math.round(result.data.current.temperature_2m)}°C`;
        }
        catch (e) {
            console.error(e.message);
        }
    }
    catch (e) {
        console.error(e.message);
        input.style.borderColor = "red";
    }
}


setTimeout(() => {
    document.querySelector(".loading__wrapper").style.display = "none";
    }, 1000);

