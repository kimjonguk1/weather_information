{
    const $weatherGrid = document.getElementById('weather-Grid');
    const $weatherCards = $weatherGrid.querySelectorAll(':scope > .weather-card'); // 모든 .weather-card 선택

    // 비동기 함수 정의
    async function fetchWeatherData() {
        for (const $weatherCard of $weatherCards) {
            const $cityname = $weatherCard.querySelector('.city-name');
            const cityName = $cityname.innerText;
            console.log(cityName);

            // Geo API 호출
            const geoUrl = new URL('http://api.openweathermap.org/geo/1.0/direct');
            geoUrl.searchParams.set('q', cityName); // 도시 이름으로 검색
            geoUrl.searchParams.set('limit', '5');
            geoUrl.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');

            try {
                const geoResponse = await fetch(geoUrl.toString());
                const geoData = await geoResponse.json();

                if (geoData.length > 0) {
                    const { lat, lon } = geoData[0]; // 위도와 경도 추출

                    // One Call API 호출
                    const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
                    weatherUrl.searchParams.set('lat', lat);
                    weatherUrl.searchParams.set('lon', lon);
                    weatherUrl.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');

                    const weatherResponse = await fetch(weatherUrl.toString());
                    const weatherData = await weatherResponse.json();

                    console.log(weatherData); // 날씨 데이터 출력 (여기서 데이터를 활용)

                    //아이콘 출력
                    const $icon = document.createElement('img');
                    $icon.classList.add('weather-icon');
                    $icon.src = ` https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                    $weatherCard.append($icon)

                    //온도 출력
                    const $degree = document.createElement('p');
                    $degree.classList.add('temperature');
                    $degree.innerText = `${Math.round( weatherData.main.temp - 273.15)}℃`
                    $weatherCard.append($degree);
                }
            } catch (error) {
                console.error(`도시 ${cityName}의 데이터를 가져오는 중 오류 발생:`, error);
            }
        }
    }

    // 함수 호출하여 날씨 데이터 불러오기
    fetchWeatherData();
}


function showDetails(index) {
    const detailsPage = document.getElementById('weather-details');
    detailsPage.style.display = 'block'; // 전체 화면으로 전환

    // 여기에 API 데이터를 불러와서 index에 맞는 상세 정보를 채워 넣는 코드를 추가할 수 있습니다.
    // 예시로는 서울의 데이터를 하드코딩 했습니다.
    const cityName = document.querySelector('.detail-city-name');
    const temp = document.querySelector('.detail-temp');
    const humidity = document.querySelector('.detail-humidity');
    const wind = document.querySelector('.detail-wind');

    // 임시 데이터 (API 연동 시 수정)
    if (index === 0) {
        cityName.textContent = '서울';
        temp.textContent = '온도: 25°C';
        humidity.textContent = '습도: 60%';
        wind.textContent = '바람: 5m/s';
    } else if (index === 1) {
        cityName.textContent = '부산';
        temp.textContent = '온도: 22°C';
        humidity.textContent = '습도: 70%';
        wind.textContent = '바람: 3m/s';
    }

}

function closeDetails() {
    const detailsPage = document.getElementById('weather-details');
    detailsPage.style.display = 'none'; // 화면에서 상세 정보 숨김
}