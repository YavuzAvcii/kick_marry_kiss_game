const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const showsContainer = document.querySelector("#shows-container");
const kickMarryKissContainer = document.querySelector(
  "#kick-marry-kiss-container"
);
let beingDraggedImg = null;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (searchInput.value) {
    const searchValue = searchInput.value;
    const shows = await takeShowsData(searchValue);
    removeOldShows();
    displayShows(shows);
    searchInput.value = "";
    addListenerToShows();
  }
});

function addListenerToShows() {
  const showDivs = document.querySelectorAll(".show-box");
  for (let showDiv of showDivs) {
    showDiv.addEventListener("click", (e) => {
      // Should take the showDiv's id;
      console.log(showDiv.id);
      // Take the id of clicked showDiv and pass it to handleKMKScreen
      handleGameScreen(showDiv.id);
      removeOldShows();
    });
  }
}

async function handleGameScreen(favShowId) {
  console.log(favShowId);
  searchForm.style.display = "none";
  const goBackBtn = document.createElement("button");
  goBackBtn.id = "go-back-btn";
  goBackBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  document.body.appendChild(goBackBtn);
  const data = await takeCastData(favShowId);
  console.log(data);
  const choosenCharacters = chooseRandChar(data);
  displayChoosenChars(choosenCharacters);
  generateKMKContainers();
  const displayedCharacterImgs = document.querySelectorAll("img");
  addDragDropEvetns(displayedCharacterImgs, kickMarryKissContainer.children);
}

function generateKMKContainers() {
  const boxNames = ["kick-box", "marry-box", "kiss-box"];
  for (let box of boxNames) {
    const kickMarryKissBox = document.createElement("div");
    const dropBox = document.createElement("div");
    const boxNameSpan = document.createElement("span");
    boxNameSpan.innerText = box;
    kickMarryKissBox.appendChild(dropBox);
    kickMarryKissBox.appendChild(boxNameSpan);
    dropBox.classList.add(box);
    kickMarryKissContainer.appendChild(kickMarryKissBox);
  }
}

function addDragDropEvetns(choosenImgs, dropBoxes) {
  for (let choosenImg of choosenImgs) {
    choosenImg.addEventListener("dragstart", (e) => {
      beingDraggedImg = e.target;
    });
  }
  for (let dropBox of dropBoxes) {
    dropBox.firstElementChild.addEventListener("dragover", (e) =>
      e.preventDefault()
    );
    dropBox.firstElementChild.addEventListener("drop", drop);
  }
}

function drop(e) {
  console.log(e.target);
  this.appendChild(beingDraggedImg);
}

function displayChoosenChars(choosenOnes) {
  for (let choosenOne of choosenOnes) {
    const characterId = choosenOne.character.id;
    const charBox = document.createElement("div");
    const charImg = document.createElement("img");
    const charName = document.createElement("span");
    charImg.src = choosenOne.character.image.medium;
    charImg.draggable = "true";
    charName.innerText = choosenOne.character.name;
    charBox.id = characterId;
    charBox.classList.add("character-box");
    charBox.appendChild(charImg);
    charBox.appendChild(charName);
    showsContainer.appendChild(charBox);
  }
}

function chooseRandChar(allChars) {
  const choosenCharacters = [];
  for (let i = 0; i < 3; i++) {
    let randNumber = Math.floor(Math.random() * allChars.length);
    while (
      choosenCharacters[i - 1] === allChars[randNumber] ||
      choosenCharacters[i - 2] === allChars[randNumber]
    ) {
      randNumber = Math.floor(Math.random() * allChars.length);
    }
    const choosenChar = allChars[randNumber];
    choosenCharacters.push(choosenChar);
  }
  console.log(choosenCharacters);
  return choosenCharacters;
}

async function takeCastData(id) {
  const url = `https://api.tvmaze.com/shows/${id}/cast`;
  const res = await axios.get(url);
  return res.data;
}

async function takeShowsData(q) {
  const url = `https://api.tvmaze.com/search/shows?q=${q}`;
  const res = await axios.get(url);
  return res.data;
}

function displayShows(data) {
  for (let showObj of data) {
    if (showObj.show.image) {
      const showObjId = showObj.show.id;
      const showBox = document.createElement("div");
      const showImg = document.createElement("img");
      const showName = document.createElement("span");
      showImg.src = showObj.show.image.medium;
      showName.innerText = showObj.show.name;
      showBox.id = showObjId;
      showBox.classList.add("show-box");
      showBox.appendChild(showImg);
      showBox.appendChild(showName);
      showsContainer.appendChild(showBox);
    }
  }
}

function removeOldShows() {
  while (showsContainer.firstElementChild) {
    showsContainer.removeChild(showsContainer.firstElementChild);
  }
}
