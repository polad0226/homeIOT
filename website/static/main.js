const ApiKey = `47bf1626e92ccfdf3696fbff8498358f`;
const lat = '33.543682';
const lon = '-86.779633';
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${ApiKey}`;

const temp = document.querySelector('.degree');
const weatherMain = document.querySelector('.weather-main');
const weatherIcon = document.querySelector('.weather-icon');

const fetchApi = async () => {
  const req = await fetch(weatherApiUrl);
  const res = await req.json();
  console.log(res);
  const currentTemp = parseInt(res['main']['temp']);
  const watherCondition = res['weather'][0]['main'];
  const weatherIconCode = res['weather'][0]['icon'];
  // temp.textContent = `${currentTemp}`;
  weatherMain.textContent = `${watherCondition}`;
  weatherIcon.setAttribute(
    'src',
    `https://openweathermap.org/img/w/${weatherIconCode}.png`
  );
};

// Light logic

fetchApi();
