let isError = false;

const toggle = document.getElementById("themeToggle");
const fontSelector = document.getElementById("fontSelector");
const btn = document.getElementById("searchButton");
const errorMessage = document.getElementById("error-message");
const wordHeading = document.getElementById("wordFound");
const definitionContainer = document.getElementById("wordMeaning");
const synonymContainer = document.getElementById("synonymContainer");
const verbDefinition = document.getElementById("verbMeaning");
const wordInput = document.getElementById("searchBar");

const fetchWordDetails = async () => {
  const word = wordInput.value;

  try {
    console.log(word);
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const [data] = await res.json();
  
    const synonymsData = data.meanings[1].synonyms || [];

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

    wordHeading.textContent = data.word;

    const definitionData = data.meanings[0].definitions.map(def => def.definition);
    
    const definitionElements = createDefinitionElements(definitionData);
    definitionContainer.replaceChildren(...definitionElements);

    const synonymElements = createSynonymElements(synonymsData);
    synonymContainer.replaceChildren(...synonymElements);

  } catch (error) {
    console.log("Error", error);
  }
}

const createDefinitionElements = (definitions) => {
    const elements = [];

    for (const def of definitions) {
      const newList =  document.createElement('li');
      newList.textContent = def;
      elements.push(newList);
    }

    return elements;
  }

const createSynonymElements = (data) => {
  const elements = [];

  for (const synonym of data) {
    const newSpan = document.createElement('span');
    newSpan.textContent = synonym;
    elements.push(newSpan);
  }

  return elements;
}

const 

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
  await fetchWordDetails();
})
