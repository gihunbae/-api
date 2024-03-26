const cities = [
    { name: "서울", latitude: "37.5665", longitude: "126.9780" },
    { name: "부산", latitude: "35.1796", longitude: "129.0756" },
    { name: "인천", latitude: "37.4563", longitude: "126.7052" },
    { name: "대구", latitude: "35.8714", longitude: "128.6014" },
    { name: "대전", latitude: "36.3504", longitude: "127.3845" },
    { name: "광주", latitude: "35.1595", longitude: "126.8526" },
    { name: "울산", latitude: "35.5384", longitude: "129.3114" },
    { name: "수원", latitude: "37.2636", longitude: "127.0286" },
    { name: "창원", latitude: "35.2270", longitude: "128.6810" }
];

const apiKey = "35751a4ab55af8aaee858624e4a8d31e";

// 각 도시의 일기 예보 정보를 가져오는 Promise를 만듦
const forecastPromises = cities.map(city => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${apiKey}&units=metric&lang=kr`;
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('날씨 정보를 가져오는 데 문제가 발생했습니다.');
            }
            return response.json();
        })
        .then(data => ({ cityName: city.name, weatherData: data }))
        .catch(error => {
            console.error(error.message);
            return null; // 에러 발생 시에도 Promise를 resolve하도록 null 반환
        });
});

// 모든 Promise가 완료될 때까지 기다림
Promise.all(forecastPromises)
    .then(weatherInfos => {
        
        // weatherInfos에는 각 도시의 날씨 정보가 순서대로 들어있음
        weatherInfos.forEach(({ cityName, weatherData }) => {
            if (weatherData) {
                displayWeather(cityName, weatherData);
            }
        });
    });

function displayWeather(cityName, data) {
    const container = document.createElement('div');
    container.classList.add('container');

    const cityElement = document.createElement('h1');
    cityElement.textContent = cityName;

    const weatherInfo = document.createElement('div');
    weatherInfo.classList.add('weather-info');

    const iconElement = document.createElement('img');
    iconElement.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`; // 일기 예보의 첫 번째 시간대의 아이콘 URL 가져오기

    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `온도: ${data.list[0].main.temp}°C`;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = `날씨: ${data.list[0].weather[0].description}`;

    const humidityElement = document.createElement('p');
    humidityElement.textContent = `습도: ${data.list[0].main.humidity}%`;

    const windElement = document.createElement('p');
    windElement.textContent = `풍속: ${data.list[0].wind.speed} m/s`;

    weatherInfo.appendChild(iconElement); // 아이콘 요소 추가
    weatherInfo.appendChild(temperatureElement);
    weatherInfo.appendChild(descriptionElement);
    weatherInfo.appendChild(humidityElement);
    weatherInfo.appendChild(windElement);

    container.appendChild(cityElement);
    container.appendChild(weatherInfo);

    document.body.appendChild(container);
}
