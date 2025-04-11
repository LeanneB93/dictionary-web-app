 let isError = false;

const toggle = document.getElementById("themeToggle");
const fontSelector = document.getElementById("fontSelector");
const btn = document.getElementById("searchButton");
const errorMessage = document.getElementById("error-message");

const phoneticsContainer = document.getElementById("phonetics");
const playButton = document.getElementById("phoneticAudioButton");

// const synonymsContainer = document.getElementById("synonymContainer");
const verbDefinition = document.getElementById("verbMeaning");
const wordInput = document.getElementById("searchBar");

const meaningsContainer = document.getElementById("meaningsContainer");

const fetchWordDetails = async () => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordInput.value}`);
    const [resp] = await res.json();

    return resp;
  } catch (error) {
    console.log("Error", error);
  }
}

const handleClick = async () => {
  const data = await fetchWordDetails();

  if (data.title === "No Definitions Found") {
    isError = true;
    errorMessage.style.display = "block";
    errorMessage.textContent = "Word not found.";
    return;
  }

  if (isError && data.title !== 'No Definitions Found') {
    errorMessage.style.display = "none";
    isError = false;
  }

  updateState(data);
}

const updateState = (data) => {
  const headingData = data.word;
  const phoneticData = data.phonetic;
  const phoneticAudioData = data.phonetics.find((item) => item.audio !== "")?.audio || data.phonetics[0]?.audio;
  // const definitionData = data.meanings[0]?.definitions?.map(def => def?.definition);
  // const synonymsData = data.meanings[1]?.synonyms || []; // TODO - Make dynamic
  // const verbData = data.meanings[1]?.definitions?.map(def => def?.definition); // TODO - Make dynamic

  createHeading(headingData);
  createPhonetic(phoneticData);
  createPhoneticAudioButton(phoneticAudioData);
  createMeaningElements(data.meanings)

  // createDefinitionElements(definitionData);
  // createSynonymElements(synonymsData);
}

const createHeading = (headingData) => {
  const wordHeading = document.getElementById("wordFound");
  wordHeading.textContent = headingData;
}

const createPhonetic = (phoneticData) => {
  const phonetic = document.getElementById("phonetics");
  phonetic.textContent = phoneticData;
}

const createPhoneticAudioButton = (phoneticAudioData) => {
  const audio = new Audio(phoneticAudioData);

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
}

const createDefinitionElements = (definitions, definitionContainer) => {
  const elements = [];

  for (const def of definitions) {
    const newList = document.createElement('li');
    newList.textContent = def.definition;
    elements.push(newList);
  }

  definitionContainer.replaceChildren(...elements);
}

const createNymElements = (nymsData, nymsContainer, title) => {
  const elements = [];

  elements.push(title);

  for (const nym of nymsData) {
    const newSpan = document.createElement('span');
    newSpan.textContent = nym;
    elements.push(newSpan);
  }

  nymsContainer.replaceChildren(...elements);
}

fontSelector.addEventListener("change", () => {
  document.body.style.fontFamily = this.value;
})

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
})

btn.addEventListener("click", async (event) => {
  event.preventDefault();
  await handleClick();
})

const createMeaningElements = (meanings) => {
  const elements = [];

  for (const meaning of meanings) {
    const newPartOfSpeechElement = document.createElement("h3");
    newPartOfSpeechElement.classList.add("predicate");
    newPartOfSpeechElement.textContent = meaning.partOfSpeech;
    elements.push(newPartOfSpeechElement);

    const lineElement = document.createElement("hr");
    lineElement.classList.add("customLine");
    elements.push(lineElement);

    const mainElement = document.createElement("div");
    mainElement.classList.add("mainMiddle");

    const titleElement = document.createElement("p");
    titleElement.classList.add("title");
    titleElement.textContent = "Meaning";

    const listContainer = document.createElement("ul");
    listContainer.li = "wordMeaning";

    mainElement.appendChild(titleElement);
    mainElement.appendChild(listContainer);


    createDefinitionElements(meaning.definitions, listContainer);

    if (meaning.synonyms.length > 0) {
      const synonymsContainer = document.createElement("div");
      synonymsContainer.classList.add("synonymsContainer");
      mainElement.appendChild(synonymsContainer);

      const synonymsTitleElement = document.createElement("p");
      synonymsTitleElement.classList.add("synonymAntonymTitle");
      synonymsTitleElement.textContent = "Synonyms"

      createNymElements(meaning.synonyms, synonymsContainer, synonymsTitleElement);
    }

    if (meaning.antonyms.length > 0) {
      const antonymsContainer = document.createElement("div");
      antonymsContainer.classList.add("synonymsContainer");
      mainElement.appendChild(antonymsContainer);

      const antonymsTitleElement = document.createElement("p");
      antonymsTitleElement.classList.add("synonymAntonymTitle");
      antonymsTitleElement.textContent = "Antonyms"

      createNymElements(meaning.antonyms, antonymsContainer, antonymsTitleElement);
    }

    elements.push(mainElement);
  }

  meaningsContainer.replaceChildren(...elements);
}