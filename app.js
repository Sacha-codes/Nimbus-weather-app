const locationInput = document.getElementById('LocationInput');
const btn = document.querySelector("button");
let TempC = document.getElementById("TempC");
let Condition = document.getElementById("Condition");
let Sunrise = document.getElementById("Sunrise");
let Sunset = document.getElementById("Sunset");
let Alerts = document.getElementById("Alerts");
let AlertTF = document.getElementById("Alert_Icon");
let SeverityA = document.getElementById("SeverityA");
let InstructionA = document.getElementById("InstructionA");
const avifSource = document.getElementById("avif-source");
const pngFallback = document.getElementById("png-fallback");
let cndNum;
let rainpercent = document.getElementById("Rain_Percentage");
let windspeed = document.getElementById("Windspeed")

function dataFetcher(locationString) {
    const finalLocation = locationString || "New York";
    fetch(`http://localhost:8080/api/weather?location=${encodeURIComponent(finalLocation)}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("Weather data received from Go:", data);
            TempC.textContent = "Temp.C = " + data.current.temp_c;
            Condition.textContent = "Condition = " + data.current.condition.text;
            cndNum = data.current.condition.code;
            let dayNight = data.current.is_day === 1 ? "day" : "night";
            updateConditionImage(cndNum, dayNight);
            windspeed.textContent = "Windspeed: " + data.current.wind_kph + " km/h";
            rainpercent.textContent = "Rain % Chances: " + data.forecast.forecastday[0].day.daily_chance_of_rain + "%";
            Sunrise.textContent = "Sunrise = " + data.forecast.forecastday[0].astro.sunrise;
            Sunset.textContent = "Sunset = " + data.forecast.forecastday[0].astro.sunset;
            if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
                Alerts.textContent = "Alerts = " + data.alerts.alert[0].event;
                SeverityA.textContent = "Severity = " + data.alerts.alert[0].severity;
                InstructionA.textContent = "Instruction = " + data.alerts.alert[0].instruction;
            } else {
                Alerts.textContent = "Alerts = No alerts";
                SeverityA.textContent = "";
                InstructionA.textContent = "";
            }
        })
        .catch(error => {
            console.error("Could not reach Go backend:", error);
        });
}

btn.addEventListener("click", () => {
    const locationString = locationInput.value.trim();
    if (locationString) {
        dataFetcher(locationString);
    }
});

dataFetcher();

const conditionToIconMap = {
    1000: 113, 1003: 116, 1006: 119, 1009: 122, 1030: 143, 1135: 248, 
    1147: 260, 1063: 176, 1072: 185, 1150: 263, 1153: 266, 1168: 281, 
    1171: 284, 1180: 293, 1183: 296, 1186: 299, 1189: 302, 1192: 305, 
    1195: 308, 1198: 311, 1201: 314, 1240: 353, 1243: 356, 1246: 359, 
    1249: 362, 1252: 365, 1261: 374, 1264: 377, 1069: 182, 1204: 317, 
    1207: 320, 1237: 350, 1066: 179, 1114: 227, 1117: 230, 1210: 323, 
    1213: 326, 1216: 329, 1219: 332, 1222: 335, 1225: 338, 1255: 368, 
    1258: 371, 1087: 200, 1273: 386, 1276: 389, 1279: 392, 1282: 395
};

function updateConditionImage(code, dayNight) {
    
    const iconNumber = conditionToIconMap[code];

    if (iconNumber) {
        avifSource.srcset = `./weather_icons/${dayNight}/${iconNumber}.avif`; 
        pngFallback.src = `./weather_icons/${dayNight}/${iconNumber}.png`; //PNG Fallback
    } else {
        console.warn(`Condition code ${code} not found in the map.`);
    }
}