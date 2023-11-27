//Declarations
const listGroup = document.querySelector(".list-group");
const searchBox = document.querySelector("#searchBox");
const pipe = document.querySelector(".pipe");
let surahLists = [];
let isHindi = false;

let favList =
  JSON.parse(localStorage.getItem("favourite-surah")) === null
    ? []
    : JSON.parse(localStorage.getItem("favourite-surah"));
//Declarations
const getSurahs = async () => {
  return (
    await fetch(
      "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_bn.json"
    )
  )
    .json()
    .then((surahs) => {
      surahLists = surahs;
      updateList(surahLists);
    })
    .catch((err) => {
      console.log(err);
    });
};
getSurahs();

searchBox.addEventListener("keyup", (e) => {
  let searchedSurah = surahLists.filter((surah) => {
    return surah.transliteration
      .toLowerCase()
      .replace("-", "")
      .startsWith(e.target.value.toLowerCase());
  });
  if (searchedSurah.length > 0) updateList(searchedSurah);
});

function updateList(array) {
  listGroup.innerHTML = "";
  array.map((surah, index) => {
    const { transliteration, name, id } = surah;
    listGroup.innerHTML += `
                <a  class="list-group-item list-group-item-action text-success"
          ><span class="bg-success index me-3">${id}</span><span class="pointer" onclick="showSurah(${
      surah.id - 1
    })">${transliteration}</span><span class="end">${name}<i class="fa-heart ms-4 ${checkFavList(
      surah
    )}"onclick="updateFavouriteList(${surah.id - 1},event)"></i></span></a
        > `;
  });
}

function checkFavList(surah) {
  let isInfav = favList.some(
    (val) => val.transliteration === surah.transliteration
  );
  if (isInfav) {
    return "fa-solid";
  } else {
    return "fa-regular";
  }
}

function updateFavouriteList(index, e) {
  if (e.target.classList.contains("fa-regular")) {
    e.target.classList.replace("fa-regular", "fa-solid");
  } else {
    e.target.classList.replace("fa-solid", "fa-regular");
  }
  let isInfav = favList.some(
    (val) => val.transliteration === surahLists[index].transliteration
  );
  if (!isInfav) {
    favList.push(surahLists[index]);
  } else {
    let searching_index = favList.findIndex(
      (surah) => surah.transliteration === surahLists[index].transliteration
    );
    favList.splice(searching_index, 1);
  }
  localStorage.setItem("favourite-surah", JSON.stringify(favList));
}

function showSurah(index) {
  translateToHindiIndex = index;
  responsiveVoice.speak(surahLists[index].transliteration);
  window.scrollTo(0, 0);
  surah = readSurah(index, isHindi);
  listGroup.innerHTML = `<div class="card surahCard">
          <div class="d-flex justify-content-between align-items center">
            <i class="fa-solid mt-3 ms-2 fa-arrow-left pointer pointer" onclick="showAllSurahs()"></i>
            <button class="btn btn-outline-dark" onclick="showHindiText(event)">Translate</button>
            </div>
          <h1 class="text-muted text-center card-subtitle ${checkHeading(
            surah
          )}">بسم الله الرحمن الرحيم</h1>
  <div class="card-body">
    ${surah}
  </div>
</div>`;
}

function checkHeading(verses) {
  if (
    verses.some((verse) => verse === "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ")
  ) {
    return "collapse";
  }
}

function readSurah(index, hindi) {
  surahLists.innerHTML = "";
  return surahLists[index].verses.map((verse) => {
    if (!hindi) {
      return verse.text;
    } else {
      return verse.translation;
    }
  });
}
function showAllSurahs() {
  pipe.classList.remove("favourites");
  searchBox.disabled = false;
  surahLists.innerHTML = "";
  updateList(surahLists);
}

function showHindiText(e) {
  if (!isHindi) {
    isHindi = true;
  } else {
    isHindi = false;
  }
  showSurah(translateToHindiIndex);
}

function togglefavorites(e) {
  pipe.classList.toggle("favourites");

  if (pipe.classList.contains("favourites")) {
    if (favList.length === 0) {
      listGroup.innerHTML = `<h4 class="text-warning text-center">No favourite surah</h4>`;
    } else updateList(favList);
  } else {
    updateList(surahLists);
  }
}
