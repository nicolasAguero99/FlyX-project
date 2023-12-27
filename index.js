// Modo oscuro

document.querySelectorAll(".text-gray-900").forEach(el => el.classList.remove("text-gray-900"))

let mode = "light";
let BTN_DARK_MODE = document.querySelector(".toggle--checkbox");

if (localStorage.getItem("mode")) {
  localStorage.getItem("mode") == "light"
  ? (document.querySelector("body").classList.remove("dark-mode"), mode = "light", BTN_DARK_MODE.checked = false)
  : (document.querySelector("body").classList.add("dark-mode"), mode = "dark", BTN_DARK_MODE.checked = true)
}

document.querySelectorAll(".btn-dark-mode").forEach(btn => 
  btn.addEventListener("click", () => {
    document.querySelector("body").classList.toggle("dark-mode")
    mode == "light"
    ? mode = "dark"
    : mode = "light"
    localStorage.setItem("mode", mode)
  })
)

// Abrir y cerrar nav mobile

if (document.querySelector("#menu-nav-mobile")) {
  document.querySelector("#menu-nav-mobile").addEventListener("click", () => {
    document.querySelector("#menu-nav-mobile").setAttribute("class", "hidden");
    document.querySelector("#nav-mobile").setAttribute("class", "lg:hidden");
  });
}

if (document.querySelector("#cross-nav-mobile")) {
  document.querySelector("#cross-nav-mobile").addEventListener("click", () => {
    document.querySelector("#menu-nav-mobile").setAttribute("class", "lg:hidden");
    document.querySelector("#nav-mobile").setAttribute("class", "hidden");
  });
}

// Trae los comentarios.json y los mostramos

  let fetchComments = async () => {
    let doFetch = await fetch(`data/comentarios.json`);
    let dataJson = await doFetch.json();
    let data = await dataJson;

    data.map((comment) => {
      let isVerify = () => {
        if (comment.verify) {
          return '<img class="w-4 h-auto" src="images/verificado.svg" alt="Perfil verificado" loading="lazy">';
        } else {
          return "";
        }
      };

      document.querySelector("#container-comentarios").innerHTML += `
        <div class="swiper-slide flex justify-center items-center">
          <div id="${comment.id}" class='lg:w-4/12 md:w-6/12 sm:w-6/12 w-full h-2/3 py-4 px-6 bg-neutral-50 flex flex-col gap-y-4 shadow-lg rounded-lg'>
            <div class='flex flex-row items-center gap-4'>
                <img width='20' height='20' class='w-16 object-contain rounded-full' src="${comment.image}" alt="Foto de perfil de ${comment.name}" loading="lazy">
                <div class='flex flex-col'>
                  <div class='flex flex-row gap-1 items-center'>
                    ${isVerify()}
                    <cite class='text-gray-950 not-italic font-medium text-lg'>${comment.name}</cite>
                  </div>
                  <span class='text-gray-500 text-sm'>${comment.profession}</span>
                </div>
              </div>
            <blockquote class='text-gray-500 text-base'>${comment.comment}</blockquote>
          </div>
        </div>
      `;
    });
  };

document.querySelector("#container-comentarios") && fetchComments();

// Creamos el siguiente array vacío, para posteriormente guardar los datos traídos de la API externa

let dataList = [];

// Creamos la siguiente función que devuelve el valor del select, para poder filtrar el resultado de los países por continente

const filterSearch = () => document.querySelector("#select-filter").value != "none" ? document.querySelector("#select-filter").value : ""

// Guardamos la funcionalidad de buscar países a través del input, dentro de la función Almacenamiento

function Almacenamiento() {
  let storage = [];

  function resetear() {
    storage = [];
    document.querySelector("#country-searched").innerHTML = ""
  }

  function agregar(data) {
    let INPUT_VALUE = document.querySelector("#value-search-country").value.toLowerCase()
    if (filterSearch() != "") {
      let filtrado = data.filter(country => country.continents[0] == filterSearch())
      storage = filtrado.filter(country => country.name.common.toLowerCase().includes(INPUT_VALUE)).slice(0, 10)
    } else {
      storage = data.filter(country => country.name.common.toLowerCase().includes(INPUT_VALUE)).slice(0, 10);
    }
  }

  function leer() {
    storage.map(country => {
      document.querySelector("#country-searched").innerHTML += `
        <div id="${country.name.common}" class="swiper-slide" style="width: fit-content">
          <div class="w-64 h-64 py-4 px-6 bg-neutral-50 flex flex-col gap-y-4  mx-auto rounded-lg">
            <img class='w-36 max-h-24 object-cover m-auto' src="${country.flags.svg}" alt="Bandera de ${country.name.common}">
            <h3 class='font-medium text-gray-950' style="white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${country.name.common}</h3>
            <h4 class='text-gray-400'>${country.capital ? country.capital[0] : "-"}</h4>
            <button class='flex items-end w-2/4 gap-x-1 font-medium leading-none rounded-lg text-indigo-700 text-left py-2 text-sm transition-color duration-200 ease-out hover:opacity-50' onclick='getSingleCountry(event)'>
              Más info <svg class="w-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4338ca"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="arrow-right"> <g> <polyline data-name="Right" fill="none" id="Right-2" points="16.4 7 21.5 12 16.4 17" stroke="#4338ca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> <line fill="none" stroke="#4338ca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.5" x2="19.2" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
            </button>
          </div>
        </div>
      `;
    })  
  }

  return {
    resetear,
    agregar,
    leer,
  };
}

const almacenamiento = new Almacenamiento();


// Al momento de escribir o borrar en el input de búsqueda, se actualiza el almacenamiento y por consiguiente se renderiza en la pnatalla

document.querySelector("#value-search-country") &&
document.querySelector("#value-search-country").addEventListener("input", () => {
  almacenamiento.resetear();
  almacenamiento.agregar(dataList);
  almacenamiento.leer();
  !document.querySelector("#value-search-country").value && almacenamiento.resetear();
})

// Al momento de cambiar el dato del select, se actualiza el almacenamiento y por consiguiente se renderiza en la pnatalla

document.querySelector("#select-filter") &&
document.querySelector("#select-filter").addEventListener("change", () => {
  almacenamiento.resetear();
  almacenamiento.agregar(dataList);
  almacenamiento.leer();
})

// Creamos la siguiente variable global, sin valor para posteriormente asignarle datos

let objectDataFav;

// Recorre los países y filtra según el país elegido y lo muestera en una card

let getSingleCountry = (event) => {
  document.querySelector("#section-single-country > div > h3").classList.remove("hidden");
  document.querySelector("#section-single-country > div > button").classList.remove("hidden");
  let countryName = event.target.closest("div").parentNode.id;

  let isExistFav = () => {
   checkData(countryName).then((data) => {
      data != undefined
      ? document.querySelector("#header-info-country").innerHTML += `<button class='w-fit h-fit absolute top-2 right-2 rounded-xl p-[4px] opacity-40 cursor-default'><svg class="w-6 fill-amber-600" viewBox="0 0 36.00 36.00" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke-width="2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <title>Ya lo has añadido a favoritos</title> <path class="clr-i-solid clr-i-solid-path-1" d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24Z"></path></g></svg></button>`
      : document.querySelector("#header-info-country").innerHTML += `<button class='w-fit h-fit absolute top-2 right-2 hover:bg-gray-200 rounded-xl p-[4px] transition-colors duration-500 [&>svg]:hover:fill-amber-500' onclick="addData(objectDataFav, event)"><svg class="w-6 fill-transparent stroke-amber-500 cursor-pointer transition-colors duration-500" viewBox="0 0 36.00 36.00" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke-width="2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <title>Añadir a favoritos</title> <path class="clr-i-solid clr-i-solid-path-1" d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24Z"></path></g></svg></button>`
    })
  }

  isExistFav()

  dataList.map(country => {
    if(country.name.common == countryName) {

    objectDataFav = {
      nombre: country.name.common,
      capital: country.capital[0],
      bandera: country.flags.svg,
      continente: country.continents ? country.continents[0] : "-",
      subregion: country.subregion,
      idiomas: Object.values(country.languages).toString().replace(/,/g, ", "),
      gentilicio: country.demonyms.eng.f + "/" + country.demonyms.eng.m,
      moneda: Object.values(country.currencies)[0].symbol + " (" + Object.values(country.currencies)[0].name + ")",
      poblacion: new Intl.NumberFormat().format(country.population),
      zonaHoraria: country.timezones[0],
      prefijo: country.idd.root,
    };

  if (document.querySelector("#container-single-country")) {
    document.querySelector("#container-single-country").innerHTML = `
      <div class="relative w-full sm:w-1/2 h-fit-content mt-8 py-4 px-6 bg-neutral-50 flex flex-col gap-y-2 mx-auto rounded-lg">
        <div class="flex flex-row align-center gap-x-4">
          <img class='w-30 max-h-20 object-cover' src="${country.flags.svg}" alt="Bandera de ${country.name.common}" loading="lazy">
          <div id="header-info-country" class="flex flex-col justify-center align-center gap-x-4">
            <h3 class="font-medium text-gray-950">${country.name.common}</h3>
            <h4 class="text-gray-400">${country.capital ?? "-"}</h4>
            <h4 class="text-gray-400">${country.continents ?? "-"}</h4>
          </div>
        </div>
        <ul class="flex flex-col gap-y-4 mt-4">
          <li class="text-gray-400"><span class="text-black">Subregión: </span>${country.subregion ?? "-"}</li>
          <li class="text-gray-400"><span class="text-black">Idiomas: </span>${country.languages? Object.values(country.languages).toString().replace(/,/g, ", "): "-"}</li>
          <li class="text-gray-400"><span class="text-black">Gentilicio: </span>${country.demonyms?.eng?.m ?? "-"}/${country.demonyms?.eng?.f ?? "-"}</li>
          <li class="text-gray-400"><span class="text-black">Moneda: </span>${country.currencies ? Object.values(country.currencies)[0].symbol: "-"} (${country.currencies ? Object.values(country.currencies)[0].name : "-"})</li>
          <li class="text-gray-400"><span class="text-black">Población: </span>${country.population ? new Intl.NumberFormat().format(country.population): "-"}</li>
          <li class="text-gray-400"><span class="text-black">Zona horaria: </span>${country.timezones[0] ?? "-"}</li>
          <li class="text-gray-400"><span class="text-black">Prefijo: </span>${country.idd.root ?? "-"}</li>
        </ul>
      </div>
    `;
    }
  };
})
  
  document.querySelector("#container-single-country").scrollIntoView({ behavior: 'smooth' });;
}

document.querySelector("#container-countries") &&
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    dataList = data;
  })
  .then(() => {
    if (document.querySelector("#container-countries")) {
      let randNum = Math.floor(Math.random() * 229);
        for (let i = randNum; i < randNum + 20; i++) {
          document.querySelector("#container-countries").innerHTML += `
          <div id="${dataList[i].name.common}" class="swiper-slide" style="width: fit-content">
            <div class="w-64 h-64 py-4 px-6 bg-neutral-50 flex flex-col gap-y-4  mx-auto rounded-lg">
              <img class='w-36 max-h-24 object-cover m-auto' src="${dataList[i].flags.svg}" alt="Bandera de ${dataList[i].name.common}" loading="lazy">
              <h3 class='font-medium text-gray-950' style="white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${dataList[i].name.common}</h3>
              <h4 class='text-gray-400'>${dataList[i].capital ? dataList[i].capital[0] : "-"}</h4>
              <button class='flex items-end w-2/4 gap-x-1 font-medium leading-none rounded-lg text-indigo-700 text-left py-2 text-sm transition-color duration-200 ease-out hover:opacity-50' onclick='getSingleCountry(event)'>
                Más info <svg class="w-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#4338ca"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="arrow-right"> <g> <polyline data-name="Right" fill="none" id="Right-2" points="16.4 7 21.5 12 16.4 17" stroke="#4338ca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> <line fill="none" stroke="#4338ca" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="2.5" x2="19.2" y1="12" y2="12"></line> </g> </g> </g> </g></svg>
              </button>
            </div>
          </div>
        `;
      }
    }
  })
  .catch((error) => {
    console.log("Error:", error);
  });


// Click al botón de favoritos para desplegar países favoritos

const toggleFavSection = () => {
  document.querySelector("#btn-fav-section").classList.contains("closedFavSection")
  ? readData(true)
  : readData(false)
  document.querySelector("#btn-fav-section").classList.toggle("closedFavSection");
  document.querySelector("#btn-fav-section svg").classList.toggle("rotate-180");
}

document.querySelector("#btn-fav-section") &&
document.querySelector("#btn-fav-section").addEventListener("click", () => toggleFavSection())

// Click para ocultar el título "Más información del país" y su respectivo botón de cierre

document.querySelector("#btn-close-info") &&
document.querySelector("#btn-close-info").addEventListener("click", () => {
  document.querySelector("#container-single-country").innerHTML = "";
  document.querySelector("#section-single-country > div > h3").classList.add("hidden");
  document.querySelector("#section-single-country > div > button").classList.add("hidden");
})

// Click para desplegar u ocultar el contenedor de próximo destino

document.querySelector("#btn-show-next-destiny") &&
document.querySelector("#btn-show-next-destiny").addEventListener("click", showDestiny = () => {
  document.querySelector("#next-destiny").classList.toggle("left-[-230px]")
  document.querySelector("#btn-show-next-destiny").classList.toggle("rotate-[-180deg]")
  if (!localStorage.getItem("prxDesEstado")) {
    localStorage.setItem("prxDesEstado", "cerrado")
  } else {
    localStorage.getItem("prxDesEstado") == "abierto" 
    ? localStorage.setItem("prxDesEstado", "cerrado")
    : localStorage.setItem("prxDesEstado", "abierto")
  }
})

localStorage.getItem("prxDesEstado") && 
(localStorage.getItem("prxDesEstado") == "cerrado" && 
  (
    document.querySelector("#next-destiny").classList.toggle("left-[-230px]"),
    document.querySelector("#btn-show-next-destiny").classList.toggle("rotate-[-180deg]")
  )
)

// Preparar la entrada y salida de la notificación de "añadido a favoritos"

const favNotification = (pais) => {
  document.querySelector("#alert-fav span").innerText = `Has agregado ${pais} a favoritos`;
  document.querySelector("#alert-fav").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector("#alert-fav").classList.remove("toUp");
  }, 1500);
  setTimeout(() => {
    document.querySelector("#alert-fav").classList.add("toUpReverse");
  }, 2000);
  setTimeout(() => {
    document.querySelector("#alert-fav").classList.add("hidden");
    document.querySelector("#alert-fav").classList.remove("toUpReverse");
    document.querySelector("#alert-fav").classList.add("toUp");
  }, 5000);
}

// Preparar la entrada y salida de la notificación de "eliminado a favoritos"

const unFavNotification = (pais) => {
  document.querySelector("#alert-unfav span").innerText = `Has eliminado ${pais} de favoritos`;
  document.querySelector("#alert-unfav").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector("#alert-unfav").classList.remove("toUp");
  }, 1500);
  setTimeout(() => {
    document.querySelector("#alert-unfav").classList.add("toUpReverse");
  }, 2000);
  setTimeout(() => {
    document.querySelector("#alert-unfav").classList.add("hidden");
    document.querySelector("#alert-unfav").classList.remove("toUpReverse");
    document.querySelector("#alert-unfav").classList.add("toUp");
  }, 5000);
}

// IndexedDb

let db;
let request = indexedDB.open("FlyX", 1);

request.onerror = function () {
  console.log("request error");
};

request.onsuccess = function () {
  db = request.result
  countData()
  getData("")
};

request.onupgradeneeded = function (event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore("Favoritos", { keyPath: "nombre" });
  objectStore.createIndex("Paises", "nombre", { unique: true });
};

const countData = () => {
  let transaction = db.transaction(["Favoritos"], "readwrite");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.count();
  
  request.onsuccess = function () {
    document.querySelector("#btn-fav-section > span") &&
    (
      document.querySelector("#btn-fav-section > span").innerText =
      request.result > 0 
      ? `Ver favoritos (${request.result})`
      : `No tienes favoritos`
    )
  };
};

const addData = (data, event) => {
  let transaction = db.transaction(["Favoritos"], "readwrite");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.add(data);
  countData();
  favNotification(data.nombre);
  let nuevoElemento = document.createElement('div');
  event.target.closest("button").removeAttribute("onclick");
  event.target.closest("button").classList.add("opacity-40");
  event.target.closest("button").innerHTML = `<svg class="w-6 fill-amber-600" viewBox="0 0 36.00 36.00" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke-width="2"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke-width="0"></g><g id="SVGRepo_iconCarrier"> <title>Ya lo has añadido a favoritos</title> <path class="clr-i-solid clr-i-solid-path-1" d="M34,16.78a2.22,2.22,0,0,0-1.29-4l-9-.34a.23.23,0,0,1-.2-.15L20.4,3.89a2.22,2.22,0,0,0-4.17,0l-3.1,8.43a.23.23,0,0,1-.2.15l-9,.34a2.22,2.22,0,0,0-1.29,4l7.06,5.55a.23.23,0,0,1,.08.24L7.35,31.21a2.22,2.22,0,0,0,3.38,2.45l7.46-5a.22.22,0,0,1,.25,0l7.46,5a2.2,2.2,0,0,0,2.55,0,2.2,2.2,0,0,0,.83-2.4l-2.45-8.64a.22.22,0,0,1,.08-.24Z"></path></g></svg>`
};

const checkData = (country) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["Favoritos"], "readwrite");
    let objectStore = transaction.objectStore("Favoritos");
    let request = objectStore.get(country);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result);
    };
  });
};

const getData = (key) => {
  let transaction = db.transaction(["Favoritos"], "readwrite");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.get(key);
  request.onsuccess = () => {
    request.result != undefined && localStorage.setItem("proximoDestino", JSON.stringify({country: request.result.nombre, flag: request.result.bandera}))

    if (localStorage.getItem("proximoDestino") && document.querySelector("#container-next-country")) {
      let getNextDestiny = JSON.parse(localStorage.getItem("proximoDestino"))
      document.querySelector("#container-next-country").innerHTML = `
        <img class="w-6 h-6 rounded-full object-cover" src="${getNextDestiny.flag}" alt="Bandera de ${getNextDestiny.country}">
        <span class='text-md font-semibold text-gray-500'>${getNextDestiny.country}</span>
      `
    }
  }
};

const deleteAllData = () => {
  let transaction = db.transaction(["Favoritos"], "readwrite");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.clear();
  countData();
  toggleFavSection();
};

const removeData = (event, key) => {
  let transaction = db.transaction(["Favoritos"], "readwrite");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.delete(key);
  event.target.closest(".card-country").remove();
  countData();
  unFavNotification(key)
};

const readData = (isClosed) => {
  let transaction = db.transaction(["Favoritos"], "readonly");
  let objectStore = transaction.objectStore("Favoritos");
  let request = objectStore.getAll();
    
  if (!isClosed) {
    document.querySelector("#container-favoritos").innerHTML = '<div class="flex justify-center gap-8 items-center"></div>';
    document.querySelector("#container-favoritos > div").innerHTML = `
      <h3 class="hidden my-8 text-center text-3xl font-bold tracking-tight">Tus países favoritos</h3>
      <button id="btn-delete-fav" onclick='deleteAllData()' class='hidden w-fit h-fit [&>svg>g>path]:stroke-red-700 [&>svg>g>path]:hover:stroke-red-900' title='Eliminar todos los favoritos'>
        <svg class='w-8 h-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
    `;
  } else {
    document.querySelector("#container-favoritos > div > h3").classList.remove("hidden");
    document.querySelector("#container-favoritos > div > button").classList.remove("hidden");
      
    request.onsuccess = (e) => {
      request.result.map((data) => {
        document.querySelector("#container-favoritos").innerHTML += `
        <div id="${data.nombre}" class="card-country relative w-full sm:w-1/2 h-fit-content mt-8 py-4 px-6 bg-neutral-50 flex flex-col gap-y-2 mx-auto rounded-lg">
          <div class="flex flex-row align-center gap-x-4">
            <img class='w-30 max-h-20 object-cover' src="${data.bandera}" alt="Bandera de ${data.nombre} loading="lazy"">
            <div class="flex flex-col justify-center align-center gap-x-4">
              <button onclick="removeData(event, '${data.nombre}')" class="absolute w-fit h-fit top-2 right-2 hover:bg-gray-200 rounded-xl p-[4px] transition-colors duration-500 [&>svg]:hover:fill-amber-500" title="Quitar de favoritos">
                <svg class="fill-amber-500 w-6 cursor-pointer transition-colors duration-500" fill="none" viewBox="0 0 32 32" enable-background="new 0 0 32 32" id="Glyph" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M29.707,29.707c-0.391,0.391-1.023,0.391-1.414,0l-26-26c-0.391-0.391-0.391-1.023,0-1.414 s1.023-0.391,1.414,0l7.458,7.458l3.089-6.629C14.58,2.43,15.249,2,16,2s1.42,0.43,1.747,1.122l3.29,6.984l7.309,1.095 c0.72,0.11,1.313,0.615,1.549,1.319c0.241,0.723,0.063,1.507-0.465,2.046l-5.323,5.436l0.527,3.218l5.073,5.073 C30.098,28.684,30.098,29.316,29.707,29.707z" id="XMLID_332_"></path><path d="M6.464,10.773c0.036-0.006,0.073,0.007,0.099,0.033l18.298,18.298c0.069,0.069,0.076,0.187,0.01,0.259 c-0.618,0.683-1.572,0.818-2.336,0.398l-6.581-3.624l-6.489,3.624c-0.644,0.354-1.418,0.312-2.02-0.114 c-0.626-0.441-0.937-1.192-0.811-1.959l1.257-7.676L2.57,14.566c-0.528-0.539-0.706-1.323-0.465-2.046 c0.235-0.704,0.829-1.209,1.549-1.319L6.464,10.773z" id="XMLID_334_"></path></g></svg>
              </button>
              <button onclick="getData('${data.nombre}')" class="absolute w-fit h-fit top-12 right-2 hover:bg-gray-200 rounded-xl p-[4px] transition-colors duration-500" title="Asignar próximo destino">
                <svg class="fill-red-500 stroke-red-500 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.9999 17V21M6.9999 12.6667V6C6.9999 4.89543 7.89533 4 8.9999 4H14.9999C16.1045 4 16.9999 4.89543 16.9999 6V12.6667L18.9135 15.4308C19.3727 16.094 18.898 17 18.0913 17H5.90847C5.1018 17 4.62711 16.094 5.08627 15.4308L6.9999 12.6667Z" stroke-width="2" stroke-linecap="round"></path> </g></svg>
              </button>
              <h3 class="font-medium text-gray-950">${data.nombre}</h3>
              <h4 class="text-gray-400">${data.capital}</h4>
              <h4 class="text-gray-400">${data.continente}</h4>
            </div>
          </div>
          <ul class="flex flex-col gap-y-4 mt-4">
            <li class="text-gray-400"><span class="text-black">Subregión: </span>${
              data.subregion ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Idiomas: </span>${
              data.idiomas ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Gentilicio: </span>${
              data.gentilicio ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Moneda: </span>${
              data.moneda ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Población: </span>${
              data.poblacion ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Zona horaria: </span>${
              data.zonaHoraria ?? "-"
            }</li>
            <li class="text-gray-400"><span class="text-black">Prefijo: </span>${
              data.prefijo ?? "-"
            }</li>
          </ul>
        </div>
      `;
      });
    }
  };
};

// Service Worker

if ("serviceWorker" in navigator) {
  try {
    var swRegistration = 
    !window.location.href.includes("pages/paises.html")
    ? navigator.serviceWorker.register("./serviceWorker.js")
    : navigator.serviceWorker.register("../serviceWorker.js");
    console.log("service worker registered");
  } catch (error) {
    console.log("service worker reg failed");
  }
} else {
  console.log("sw not supperted");
}