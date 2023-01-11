const translation = {
  ru: {
    greet: {
      night: "Доброй ночи",
      morning: "Доброе утро",
      afternoon: "Доброго дня",
      evening: "Доброго вечера",
    },
    weather: {
      Windspeed: "Скорость ветра",
      Humidity: "Влажность",
      postfix: "м/с",
    },
    language: "ru-RU",
    settingsTranslate: {
      language: "Язык:",
      player: "Плеер:",
      time: "Время:",
      date: "Дата:",
      greeting: "Приветствие:",
      quotes: "Цитаты:",
      weather: "Погода:",
      background: "Фон:",
      todo: "Задачи:",
    },
    placeholder: "[Введите имя]",
  },
  en: {
    greet: {
      night: "Good night",
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    weather: {
      Windspeed: "Wind speed",
      Humidity: "Humidity",
      postfix: "m/s",
    },
    language: "en-US",
    settingsTranslate: {
      language: "Language:",
      player: "Player:",
      time: "Time:",
      date: "Date:",
      greeting: "Greeting:",
      quotes: "Quotes:",
      weather: "Weather:",
      background: "Background:",
      todo: "Todos:",
    },
    placeholder: "[Enter name]",
  },
};

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}

const playList = [
  {
    title: "Aqua Caelestis",
    src: "./music/assets_sounds_Aqua Caelestis.mp3",
    duration: 39,
  },
  {
    title: "River Flows In You",
    src: "./music/assets_sounds_River Flows In You.mp3",
    duration: 97,
  },
  {
    title: "Summer Wind",
    src: "./music/assets_sounds_Summer Wind.mp3",
    duration: 110,
  },
  {
    title: "Ennio Morricone",
    src: "./music/assets_sounds_Ennio Morricone.mp3",
    duration: 97,
  },
];

let settings = {
  blocks: [],
  language: "en",
  currentBgSrc: "github",
};

const time = document.querySelector(".time");
const greeting = document.querySelector(".greeting");
const mainDate = document.querySelector(".date");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const city = document.querySelector(".city");
const list = document.querySelector(".play-list");
const timeLine = document.querySelector(".timeline");

const audio = new Audio();
let playNum = 0;
let randomNum;
let isPlay = false;
let prevTime;
let todoList = [];

function setLocalStorage() {
  const name = document.querySelector(".name");
  const city = document.querySelector(".city");
  localStorage.setItem("name", name.value);
  localStorage.setItem("city", city.value);
  localStorage.setItem("settings", JSON.stringify(settings));
  localStorage.setItem("todo", JSON.stringify(todoList));
}
window.addEventListener("beforeunload", setLocalStorage);

function getLocalStorage() {
  const name = document.querySelector(".name");
  const city = document.querySelector(".city");
  if (localStorage.getItem("name")) {
    name.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
    getWeather(settings.language);
  }
  if (localStorage.getItem("settings")) {
    let localSettings = JSON.parse(localStorage.getItem("settings"));
    settings.language = localSettings.language;
    settings.blocks = localSettings.blocks;
    settings.currentBgSrc = localSettings.currentBgSrc;
    setDisplay();
    setBg(settings.currentBgSrc);
  }
  if (localStorage.getItem("todo")) {
    let localTodos = JSON.parse(localStorage.getItem("todo"));
    todoList = Array.from(localTodos);
    newTodo();
  }
}
window.addEventListener("load", getLocalStorage);

timeLine.addEventListener(
  "click",
  (e) => {
    prevTime = 0;
    const timelineWidth = window.getComputedStyle(timeLine).width;
    const timeToSeek =
      (e.offsetX / parseInt(timelineWidth)) * playList[playNum].duration;
    audio.currentTime = timeToSeek;
    prevTime = timeToSeek;
  },
  false
);

setInterval(() => {
  const progressBar = document.querySelector(".progress");
  progressBar.style.width =
    (audio.currentTime / playList[playNum].duration) * 100 + "%";
  document.querySelector(".current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 500);

for (let i = 0; i < playList.length; i++) {
  let item = document.createElement("li");
  item.classList.add("play-item");
  item.textContent = playList[i].title;
  let newItem = document.createElement("button");
  newItem.myIndex = i;
  newItem.classList.add("player-icon-li");
  item.appendChild(newItem);
  list.append(item);
  newItem.addEventListener("click", (e) => {
    everySongPlay(e);
  });
}

function everySongPlay(e) {
  if (e.target.myIndex == playNum) {
  } else {
    isPlay = false;
    prevTime = 0;
    playNum = e.target.myIndex;
    e.target.classList.remove("pause");
  }
  playAudio();
}

function playAudio() {
  let liArr = document.querySelectorAll(".player-icon-li");
  liArr.forEach((el) => {
    el.classList.remove("pause");
  });
  if (!isPlay) {
    isPlay = true;
    audio.src = playList[playNum].src;
    document.querySelector(".play").classList.add("pause");
    if (prevTime) {
      audio.currentTime = prevTime;
    }
    audio.play();
    liArr.forEach((el) => {
      if (el.myIndex === playNum) {
        el.classList.add("pause");
      }
    });
  } else {
    isPlay = false;
    document.querySelector(".play").classList.remove("pause");
    prevTime = audio.currentTime;
    audio.pause();
  }
  currentSong();
  document.querySelector(".current-song").textContent = playList[playNum].title;
}

document.querySelector(".current-song").textContent = playList[0].title;
document.querySelector(".play").addEventListener("click", playAudio);
document.querySelector(".play-prev").addEventListener("click", playPrev);
document.querySelector(".play-next").addEventListener("click", playNext);
document.querySelector(".length").textContent = getTimeCodeFromNum(
  playList[playNum].duration
);

audio.addEventListener(
  "loadeddata",
  () => {
    document.querySelector(".length").textContent = getTimeCodeFromNum(
      playList[playNum].duration
    );
    audio.volume = 0.5;
  },
  false
);

// mute button
document.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = document.querySelector(".volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});

//click volume slider to change volume
const volumeSlider = document.querySelector(".volume-slider");
volumeSlider.addEventListener(
  "click",
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    document.querySelector(".volume-percentage").style.width =
      newVolume * 100 + "%";
  },
  false
);

// player loop
audio.addEventListener("ended", playNext);

function playNext() {
  prevTime = 0;
  if (playNum < playList.length - 1) {
    playNum += 1;
  } else {
    playNum = 0;
  }
  isPlay = false;
  playAudio();
}

function playPrev() {
  prevTime = 0;
  if (playNum > 0) {
    playNum -= 1;
  } else {
    playNum = playList.length - 1;
  }
  isPlay = false;
  playAudio();
}

function currentSong() {
  document
    .querySelectorAll(".item-active")
    .forEach((el) => el.classList.remove("item-active"));
  list.children[playNum].classList.add("item-active");
}
currentSong();

// --- time, date and greeting ---
function showTime() {
  const date = new Date();
  let currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  greeting.textContent = translation[settings.language].greet[getTimeOfDay()];
  showDate();
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const date = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const currentDate = date.toLocaleDateString(settings.language, options);
  mainDate.textContent = currentDate;
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  let timeOfDay = "";
  if (hours >= 0 && hours < 6) {
    timeOfDay = "night";
  } else if (hours >= 6 && hours < 12) {
    timeOfDay = "morning";
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }
  return timeOfDay;
}

function getRandomNum() {
  randomNum = Math.ceil(Math.random() * 20);
}
getRandomNum(20);

async function flickrBg() {
  try {
    const key = "0f15ff623f1198a1f7f52550f8c36057";
    let tag = "nigth,nature";
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${key}&tags=${tag}&tag_mode=all&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const amount = Math.ceil(Math.random() * data.photos.photo.length);
    let sortPhotos = [];
    data.photos.photo.forEach((element) => {
      if (element.width_l > element.height_l) {
        sortPhotos.push(element);
      }
    });
    const img = new Image();
    img.src = sortPhotos[amount].url_l;
    img.onload = () => {
      document.querySelector(
        "body"
      ).style.backgroundImage = `url(${sortPhotos[amount].url_l})`;
    };
  } catch (error) {
    console.log(error);
  }
}

async function unsplashBg() {
  try {
    const key = "LDtlDFLzCJjFqqQ4I-2BzeDebMVCGwhMKnu-LLgR4Pw";
    let tag = "nature";
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    let photoSrc = data.urls.full;
    const img = new Image();
    img.src = photoSrc;
    img.onload = () => {
      document.querySelector("body").style.backgroundImage = `url(${photoSrc})`;
    };
  } catch (error) {
    console.log(error);
  }
}

async function githubBg() {
  try {
    let dayTime = getTimeOfDay();
    let bgNum = String(randomNum).padStart(2, "0");
    let newLink = `https://raw.githubusercontent.com/gamesam88/stage1-tasks/assets/images/${dayTime}/${bgNum}.jpg`;
    const img = new Image();
    img.src = newLink;
    img.onload = () => {
      document.querySelector("body").style.backgroundImage = `url(${newLink})`;
    };
  } catch (error) {
    console.log(error);
  }
}

function setBg(key) {
  switch (key) {
    case "github":
      githubBg();
      break;
    case "flickr":
      flickrBg();
      break;
    case "unsplash":
      unsplashBg();
      break;
    default:
      break;
  }
}

document.querySelector(".back-input").addEventListener("change", () => {
  settings.currentBgSrc = document.querySelector(".back-input").value;
  setBg(settings.currentBgSrc);
});

function getSlideNext(key) {
  switch (key) {
    case "github":
      if (randomNum < 20) {
        randomNum = randomNum + 1;
      } else {
        randomNum = 1;
      }
      githubBg(settings.currentBgSrc);
      break;
    case "flickr":
      flickrBg(settings.currentBgSrc);
      break;
    case "unsplash":
      unsplashBg(settings.currentBgSrc);
      break;
    default:
      break;
  }
}

function getSlidePrev(key) {
  switch (key) {
    case "github":
      if (randomNum > 1) {
        randomNum = randomNum - 1;
      } else {
        randomNum = 20;
      }
      githubBg(settings.currentBgSrc);
      break;
    case "flickr":
      flickrBg(settings.currentBgSrc);
      break;
    case "unsplash":
      unsplashBg(settings.currentBgSrc);
      break;
    default:
      break;
  }
}

slideNext.addEventListener("click", () => {
  getSlideNext(settings.currentBgSrc);
});
slidePrev.addEventListener("click", () => {
  getSlidePrev(settings.currentBgSrc);
});

async function getWeather() {
  try {
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${settings.language}&appid=484578b0ff74ee89273afbfde936fe51&units=metric`;
    const res = await fetch(weatherApi);
    const data = await res.json();
    if (data.cod == "404") {
      throw new Error(data.message);
    }
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.floor(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `${
      translation[settings.language].weather.Windspeed
    }: ${Math.floor(data.wind.speed)} ${
      translation[settings.language].weather.postfix
    }`;
    humidity.textContent = `${
      translation[settings.language].weather.Humidity
    }: ${data.main.humidity}%`;
    document.querySelector(".weather-error").textContent = "";
  } catch (e) {
    document.querySelector(".weather-error").textContent = e.message;
    temperature.textContent = "";
    weatherDescription.textContent = "";
    wind.textContent = "";
    humidity.textContent = "";
  }
}
city.addEventListener("change", getWeather);

async function getQuotes() {
  const quotes = "data.json";
  let n = Math.floor(Math.random() * 20);
  let res = await fetch(quotes);
  let data = await res.json();
  document.querySelector(".quote").textContent = `"${
    data[settings.language][n].text
  }"`;
  document.querySelector(".author").textContent =
    data[settings.language][n].author;
}
document.querySelector(".change-quote").addEventListener("click", getQuotes);

function changeLang() {
  settings.language = document.querySelector(".lang-input").value;
  document.querySelector(".name").placeholder =
    translation[settings.language].placeholder;
  showTime();
  getQuotes();
  traslateSettings();
  getWeather();
}
document.querySelector(".lang-input").addEventListener("change", changeLang);

document.querySelector(".icono-gear").addEventListener("click", () => {
  document.querySelector(".settings").classList.add("menu-active");
  document.querySelector(".icono-gear").classList.add("rotate");
  setTimeout(() => {
    document.querySelector(".settings-wrapper").classList.add("settingsMove");
  }, 0);
  setTimeout(() => {
    document.querySelector(".gear").classList.add("gear-disable");
  }, 1000);
  clearTimeout();
});

document.querySelector(".settings").addEventListener("click", (e) => {
  if (
    e.target.classList.contains("settings") &&
    document.querySelector(".gear").classList.contains("gear-disable")
  ) {
    document
      .querySelector(".settings-wrapper")
      .classList.remove("settingsMove");
    document.querySelector(".gear").classList.remove("gear-disable");
    setTimeout(() => {
      document.querySelector(".icono-gear").classList.remove("rotate");
    }, 0);
    setTimeout(() => {
      document.querySelector(".settings").classList.remove("menu-active");
    }, 1000);
    clearTimeout();
  }
});

document
  .querySelector(".player-input")
  .addEventListener("click", (e) => addToBlocks(e));
document
  .querySelector(".weather-input")
  .addEventListener("click", (e) => addToBlocks(e));
document
  .querySelector(".quotes-input")
  .addEventListener("click", (e) => addToBlocks(e));
document
  .querySelector(".greeting-input")
  .addEventListener("click", (e) => addToBlocks(e));
document
  .querySelector(".time-input")
  .addEventListener("click", (e) => addToBlocks(e));
document
  .querySelector(".date-input")
  .addEventListener("click", (e) => addToBlocks(e));
document.querySelector(".todos-input").addEventListener("click", (e) => {
  addToBlocks(e);
  let todoBt = document.querySelector(".todo-button").classList;
  if (todoBt.contains("item-none")) {
    document.querySelector(".todo").classList.remove("todo-active");
  }
});

function addToBlocks(e) {
  if (settings.blocks.indexOf(e.target.value) === -1) {
    settings.blocks.push(e.target.value);
  } else {
    let num = settings.blocks.indexOf(e.target.value);
    settings.blocks.splice(num, 1);
  }
  setDisplay();
}

function setDisplay() {
  let arr = document.querySelectorAll(".item-none");
  arr.forEach((elem) => {
    elem.classList.remove("item-none");
  });
  settings.blocks.forEach((element) => {
    document.querySelector(element).classList.add("item-none");
  });

  document.querySelectorAll(".checkbox").forEach((elem) => {
    if (settings.blocks.includes(elem.value)) {
      elem.checked = false;
    } else {
      elem.checked = true;
    }
  });
  getQuotes();
  check();
  traslateSettings();
}

function traslateSettings() {
  let settingsNames = document.querySelectorAll(".settings-language");
  settingsNames.forEach((element) => {
    element.textContent =
      translation[settings.language].settingsTranslate[element.id];
  });
}

function check() {
  let bg = settings.currentBgSrc;
  if (bg == "github") {
    document.querySelector(".back-input").selectedIndex = 0;
  } else if (bg == "flickr") {
    document.querySelector(".back-input").selectedIndex = 1;
  } else {
    document.querySelector(".back-input").selectedIndex = 2;
  }

  let x = settings.language;
  if (x == "ru") {
    document.querySelector(".lang-input").selectedIndex = 1;
  } else {
    document.querySelector(".lang-input").selectedIndex = 0;
  }
}

function newTodo() {
  let myTodos = document.querySelector(".todo-list");
  while (myTodos.firstChild) {
    myTodos.removeChild(myTodos.firstChild);
  }
  todoList.forEach((text, id) => {
    let newTodoItem = document.createElement("li");
    newTodoItem.classList.add("todo-item");
    let btn = document.createElement("div");
    btn.classList.add("icono-cross");
    btn.btnIndex = id;
    btn.addEventListener("click", (e) => {
      deleteTodo(e);
      newTodo();
    });
    newTodoItem.append(btn);
    newTodoItem.insertAdjacentHTML("afterbegin", `<p>${id + 1}. ${text}</p>`);
    myTodos.append(newTodoItem);
  });
}
document.querySelector(".todo-add").addEventListener("click", () => {
  let text = document.querySelector(".todo-input").value;
  if (text) {
    todoList.push(text);
    document.querySelector(".todo-input").value = "";
    newTodo();
  }
});

function deleteTodo(e) {
  let start = e.target.btnIndex;
  if (todoList.length != 0) {
    console.log("asdsa");
    todoList.splice(start, 1);
  }
}

function openCloseTodo() {
  let todo = document.querySelector(".todo");
  if (todo.classList.contains("todo-active")) {
    todo.classList.remove("todo-active");
  } else {
    todo.classList.add("todo-active");
  }
}

document.querySelector(".todo-button").addEventListener("click", openCloseTodo);
