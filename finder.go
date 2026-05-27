package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
)

type WeatherResponse struct {
	Current  CurrentData  `json:"current"`
	Forecast ForecastData `json:"forecast"`
	Alerts   AlertsData   `json:"alerts"`
}

type CurrentData struct {
	TemperatureC float64        `json:"temp_c"`
	Condition    ConditionData  `json:"condition"`
	AirQuality   AirQualityData `json:"air_quality"`
	DayNight     int            `json:"is_day"`
	Windspeed    float32        `json:"wind_kph"`
}

type ConditionData struct {
	Text string `json:"text"`
	Icon string `json:"icon"`
	Code int    `json:"code"`
}

type AirQualityData struct {
	Co         float64 `json:"co"`
	No2        float64 `json:"no2"`
	O3         float64 `json:"o3"`
	Pm25       float64 `json:"pm2_5"`
	Pm10       float64 `json:"pm10"`
	UsEpaIndex int     `json:"us-epa-index"`
}

type ForecastData struct {
	ForecastDay []ForecastDayItem `json:"forecastday"`
}

type ForecastDayItem struct {
	Astro AstroData `json:"astro"`
	Day   DayData   `json:"day"`
}

type DayData struct {
	RainPercent int `json:"daily_chance_of_rain"`
}

type AstroData struct {
	Sunrise string `json:"sunrise"`
	Sunset  string `json:"sunset"`
}

type AlertsData struct {
	AlertList []AlertItem `json:"alert"`
}

type AlertItem struct {
	Headline    string `json:"headline"`
	Severity    string `json:"severity"`
	Urgency     string `json:"urgency"`
	Areas       string `json:"areas"`
	Category    string `json:"category"`
	Certainty   string `json:"certainty"`
	Event       string `json:"event"`
	Description string `json:"desc"`
	Instruction string `json:"instruction"`
}

func main() {
	http.HandleFunc("/api/weather", getWeather)
	fmt.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil) //You can use different ports, I just used 8080 for convenience
}

func getWeather(w http.ResponseWriter, r *http.Request) {

	var request string

	request = r.URL.Query().Get("location")

	safeLocation := url.QueryEscape(request)

	apiKey := "example123" // Use real API key of yours

	apiURL := "https://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&q=" + safeLocation + "&days=1&aqi=yes&alerts=yes"

	resp, err := http.Get(apiURL)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Response status:", resp.Status)

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API Error! Server returned status code %d. Make sure the city exists.\n", resp.StatusCode)
		return
	}

	var weather WeatherResponse

	err = json.NewDecoder(resp.Body).Decode(&weather)
	if err != nil {
		panic(err)
	}

	jsonWeather, err := json.Marshal(weather)
	if err != nil {
		log.Fatalf("Error occurred during marshalling: %s", err.Error())
	}

	w.Header().Set("Content-Type", "application/json")

	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Write(jsonWeather)
}
