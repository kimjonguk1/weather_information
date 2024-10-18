const $loading = document.body.querySelector(':scope > .loading');
const showLoading = () => $loading.classList.add('--visible');
const hideLoading = () => $loading.classList.remove('--visible')


{
    const $weatherGrid = document.getElementById('weather-Grid');
    const $weatherCards = $weatherGrid.querySelectorAll(':scope > .weather-card'); // 모든 .weather-card 선택

    // 비동기 함수 정의
    async function fetchWeatherData() {
        for (const $weatherCard of $weatherCards) {


            const $cityname = $weatherCard.querySelector('.city-name');
            const cityName = $cityname.innerText;
            console.log(cityName);
            showLoading();

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
        hideLoading();
    }

    // 함수 호출하여 날씨 데이터 불러오기
    fetchWeatherData();
}

{
    const $addform = document.getElementById('add-city-form');
    $addform.onsubmit = (e) => {
        e.preventDefault();

        const xhr = new XMLHttpRequest();
        const url = new URL('http://api.openweathermap.org/geo/1.0/direct');

        // 사용자 입력을 받아 도시 이름으로 Geo API 요청
        url.searchParams.set('q', $addform['addCity'].value);
        url.searchParams.set('limit', '5');
        url.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');

        xhr.onreadystatechange = () => {
            if(xhr.readyState !== XMLHttpRequest.DONE) return;
            if(xhr.status < 200 || xhr.status >= 300) return;

            const response = JSON.parse(xhr.responseText);

            if (!response[0] || typeof response[0].lat === 'undefined' || typeof response[0].lon === 'undefined') {
                alert('일치하는 도시가 없습니다.');
                hideLoading(); // 로딩 상태 중지
                return;  // 함수 실행 중단
            }


            // 위도와 경도 확인
            const lat = response[0].lat;
            const lon = response[0].lon;


            // 날씨 정보를 가져오기 위한 두 번째 API 요청
            const weatherXhr = new XMLHttpRequest();
            const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
            weatherUrl.searchParams.set('lat', lat);
            weatherUrl.searchParams.set('lon', lon);
            weatherUrl.searchParams.set('lang', 'kr');
            weatherUrl.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');

            weatherXhr.onreadystatechange = () => {
                if(weatherXhr.readyState !== XMLHttpRequest.DONE) return;
                if(weatherXhr.status < 200 || weatherXhr.status >= 300) return;
                hideLoading();

                const weatherResponse = JSON.parse(weatherXhr.responseText);

                // 새 날씨 카드를 그리드에 추가
                const $weatherGrid = document.getElementById('weather-Grid');

                // 카드 생성
                const $card = document.createElement('div');
                $card.classList.add('weather-card');

                // 도시 이름 생성
                const $text = document.createElement('h2');
                $text.classList.add('city-name');
                $text.innerText = weatherResponse.name;

                // 온도 정보 생성
                const $temp = document.createElement('p');
                $temp.classList.add('temperature');
                const temperature = Math.round(weatherResponse.main.temp - 273.15); // 켈빈을 섭씨로 변환
                $temp.innerText = `${temperature}°C`;

                // 날씨 아이콘 생성
                const $icon = document.createElement('img');
                $icon.classList.add('weather-icon');
                $icon.src = `https://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}.png`;
                $icon.alt = weatherResponse.weather[0].description;

                // 카드에 요소 추가
                $card.append($text);
                $card.append($icon);
                $card.append($temp);

                // 날씨 카드 그리드에 새 카드 추가
                $weatherGrid.append($card);

                console.log($card); // 생성된 카드 확인
            };

            weatherXhr.open('GET', weatherUrl.toString());
            weatherXhr.send();
        };

        xhr.open('GET', url.toString());
        xhr.send();
        showLoading();
    };
}

// 번역
function wDescEngToKor(w_id) {
    var w_id_arr = [201,200,202,210,211,212,221,230,231,232,
        300,301,302,310,311,312,313,314,321,500,
        501,502,503,504,511,520,521,522,531,600,
        601,602,611,612,615,616,620,621,622,701,
        711,721,731,741,751,761,762,771,781,800,
        801,802,803,804,900,901,902,903,904,905,
        906,951,952,953,954,955,956,957,958,959,
        960,961,962];
    var w_kor_arr = ["가벼운 비를 동반한 천둥구름","비를 동반한 천둥구름","폭우를 동반한 천둥구름","약한 천둥구름",
        "천둥구름","강한 천둥구름","불규칙적 천둥구름","약한 연무를 동반한 천둥구름","연무를 동반한 천둥구름",
        "강한 안개비를 동반한 천둥구름","가벼운 안개비","안개비","강한 안개비","가벼운 적은비","적은비",
        "강한 적은비","소나기와 안개비","강한 소나기와 안개비","소나기","약한 비","중간 비","강한 비",
        "매우 강한 비","극심한 비","우박","약한 소나기 비","소나기 비","강한 소나기 비","불규칙적 소나기 비",
        "가벼운 눈","눈","강한 눈","진눈깨비","소나기 진눈깨비","약한 비와 눈","비와 눈","약한 소나기 눈",
        "소나기 눈","강한 소나기 눈","박무","연기","연무","모래 먼지","안개","모래","먼지","화산재","돌풍",
        "토네이도","구름 한 점 없는 맑은 하늘","약간의 구름이 낀 하늘","드문드문 구름이 낀 하늘","구름이 거의 없는 하늘",
        "구름으로 뒤덮인 흐린 하늘","토네이도","태풍","허리케인","한랭","고온","바람부는","우박","바람이 거의 없는",
        "약한 바람","부드러운 바람","중간 세기 바람","신선한 바람","센 바람","돌풍에 가까운 센 바람","돌풍",
        "심각한 돌풍","폭풍","강한 폭풍","허리케인"];
    for(var i=0; i<w_id_arr.length; i++) {
        if(w_id_arr[i]==w_id) {
            return w_kor_arr[i];
            break;
        }
    }
    return "none";
}

document.addEventListener('DOMContentLoaded', () => {
    const $weatherGrid = document.getElementById('weather-Grid');
    const $weatherCards = $weatherGrid.querySelectorAll('.weather-card');
    const $mainContent = document.getElementById('main-content');
    const $weatherDetails = document.getElementById('weather-details');
    const $detailCityName = document.getElementById('detail-city-name');
    const $detailTemp = document.getElementById('detail-temp');
    const $detailDesc = document.getElementById('detail-desc');
    const $detailIcon = document.getElementById('detail-icon');
    const $closeDetails = document.getElementById('close-details');
    const $loading = document.getElementById('loading');

    // 상세 정보 섹션 숨기기 함수
    const hideDetails = () => {
        $weatherDetails.style.display = 'none';
        $mainContent.style.display = 'block';
    };

    // 상세 정보 섹션 표시 함수
    const showDetails = () => {
        $weatherDetails.style.display = 'block';
        $mainContent.style.display = 'none';
    };

    // 닫기 버튼 클릭 시 상세 정보 섹션 숨기기
    $closeDetails.addEventListener('click', hideDetails);

    // 각 날씨 카드에 클릭 이벤트 추가
    $weatherGrid.addEventListener('click', async (event) => {

        const $clickedCard = event.target.closest('.weather-card');
        if (!$clickedCard) return;  // 클릭한 요소가 .weather-card가 아니면 무시
        showLoading();

        const cityName = $clickedCard.querySelector('.city-name').innerText;


        $detailCityName.innerText = '';  // 도시 이름 초기화
        $detailTemp.innerText = '';      // 온도 초기화
        $detailDesc.innerText = '';      // 설명 초기화
        $detailIcon.src = '';            // 아이콘 초기화

        // 이전에 동적으로 추가한 요소들을 모두 삭제
        const extraDetails = $weatherDetails.querySelectorAll('p:not(#detail-temp):not(#detail-desc)');
        extraDetails.forEach(el => el.remove());  // 동적으로 추가된 <p> 태그 제거

            // Geo API 호출 (도시 이름을 통해 위도/경도 가져오기)
            const geoUrl = new URL('http://api.openweathermap.org/geo/1.0/direct');
            geoUrl.searchParams.set('q', cityName);
            geoUrl.searchParams.set('limit', '1');
            geoUrl.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');

            try {
                const geoResponse = await fetch(geoUrl.toString());
                const geoData = await geoResponse.json();

                if (geoData.length > 0) {
                    const { lat, lon } = geoData[0]; // 위도, 경도 추출

                    // Weather API 호출
                    const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
                    weatherUrl.searchParams.set('lat', lat);
                    weatherUrl.searchParams.set('lon', lon);
                    weatherUrl.searchParams.set('appid', '05e2e6a2db31162237d37ea54a4a68e7');
                    weatherUrl.searchParams.set('lang', 'kr');

                    const weatherResponse = await fetch(weatherUrl.toString());
                    const weatherData = await weatherResponse.json();
                    console.log(wDescEngToKor(weatherData.weather[0].id));
                    const weatherDescription = wDescEngToKor(weatherData.weather[0].id);
                    console.log(weatherDescription);
                    updateBackgroundVideo(weatherDescription);

                    // 날씨 데이터를 상세 정보 섹션에 추가
                    $detailCityName.innerText = weatherData.name;

                    const temp = Math.round(weatherData.main.temp - 273.15);
                    const feelsLike = Math.round(weatherData.main.feels_like - 273.15);
                    const humidity = weatherData.main.humidity;
                    const windSpeed = weatherData.wind.speed;
                    const clouds = weatherData.clouds.all;

                    // 데이터를 보기 좋게 포맷하여 HTML에 표시
                    $detailTemp.innerText = `온도: ${temp}℃`;
                    $detailFeelsLike = document.createElement('p');
                    $detailFeelsLike.innerText = `체감온도: ${feelsLike}℃`;

                    $detailHumidity = document.createElement('p');
                    $detailHumidity.innerText = `습도: ${humidity}%`;

                    $detailWindSpeed = document.createElement('p');
                    $detailWindSpeed.innerText = `풍속: ${windSpeed}m/s`;

                    $detailClouds = document.createElement('p');
                    $detailClouds.innerText = `흐림 정도: ${clouds}%`;

                    $closeDetails.insertAdjacentElement('beforebegin', $detailFeelsLike);
                    $closeDetails.insertAdjacentElement('beforebegin', $detailHumidity);
                    $closeDetails.insertAdjacentElement('beforebegin', $detailWindSpeed);
                    $closeDetails.insertAdjacentElement('beforebegin', $detailClouds);
                    $detailIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
                    showDetails();
                    hideLoading();
                }
            } catch (error) {
                console.error(`도시 ${cityName}의 날씨 정보를 가져오는 중 오류 발생:`, error);
            }
        });
});

function updateBackgroundVideo(weatherDescription) {
    const $videoSource = document.getElementById('video-source');

    const videoMapping = {
        '천둥번개' : 'videos/thunderstorm.mp4',
        '맑은하늘' : 'videos/clear-sky.mp4',
        '흐림' : 'videos/cloudy.mp4',
        '눈' : 'videos/snow.mp4',
        '바람' : 'videos/wind.mp4',
        '비' : 'videos/rain.mp4',
        '안개' : 'videos/fog.mp4',
    };

    let videoSrc = 'videos/default.mp4';

    switch (weatherDescription) {
        case '가벼운 비를 동반한 천둥구름':
        case '비를 동반한 천둥구름':
        case '폭우를 동반한 천둥구름':
        case '약한 천둥구름':
        case '천둥구름':
        case '강한 천둥구름':
        case '불규칙적 천둥구름':
        case '약한 연무를 동반한 천둥구름':
            videoSrc = 'videos/thunderstorm.mp4';
            break;

        case '가벼운 안개비':
        case '안개비':
        case '강한 안개비':
        case '약한 비':
        case '중간 비':
        case '강한 비':
        case '매우 강한 비':
        case '극심한 비':
        case '소나기':
            videoSrc = 'videos/rain.mp4';
            break;

        case '가벼운 눈':
        case '눈':
        case '강한 눈':
        case '소나기 눈':
            videoSrc = 'videos/snow.mp4';
            break;

        case '구름 한 점 없는 맑은 하늘':
            videoSrc = 'videos/clear-sky.mp4';
            break;

        case '약간의 구름이 낀 하늘':
        case '드문드문 구름이 낀 하늘':
        case '구름이 거의 없는 하늘':
        case '구름으로 뒤덮인 흐린 하늘':
            videoSrc = 'videos/cloudy.mp4';
            break;

        case '안개':
        case '연무':
        case '박무':
            videoSrc = 'videos/fog.mp4';
            break;

        case '강한 바람':
        case '돌풍':
        case '심각한 돌풍':
            videoSrc = 'videos/wind.mp4';
            break;

        default:
            videoSrc = 'videos/default.mp4';  // 기본 비디오
            break;
    }
    $videoSource.src = videoSrc;
    document.getElementById('background-video').load();
}