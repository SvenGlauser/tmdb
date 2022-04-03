let input = document.getElementById("findInput")

let films = document.querySelector(".films")

let pages = document.querySelector(".pages")

let load = document.querySelector(".load")

let FILMS = []
let SERIES = []

let PAGE
let MAX_PAGE

change()

async function change(page = 1) {
    PAGE = page

    findFilm(input.value, page)
}

function findFilm(query) {
    fetch("https://api.themoviedb.org/3/search/movie?api_key=15f9d7fec19ec6b5b9bc491acd508fe6&query=" + query + "&page=" + PAGE, {
        method: "GET"
    }).then(async result => {
        let result_films = await result.json()

        FILMS = result_films.results
        console.table(FILMS)

        MAX_PAGE = result_films.total_pages

        findSerie(query)
    })
}

function findSerie(query) {
    fetch("https://api.themoviedb.org/3/search/tv?api_key=15f9d7fec19ec6b5b9bc491acd508fe6&query=" + query + "&page=" + PAGE, {
        method: "GET"
    }).then(async result => {
        let result_serie = await result.json()

        SERIES = result_serie.results
        console.table(SERIES)

        MAX_PAGE = MAX_PAGE < result_serie.total_pages ? result_serie.total_pages : MAX_PAGE

        mettreJour()
    })
}

function mettreJour() {
    films.innerHTML = ""

    FILMS.forEach(value => {
        value.type = "film"
    })

    SERIES.forEach(value => {
        value.type = "serie"
    })

    FILMS.concat(SERIES).sort((a, b) => {
        return b.popularity - a.popularity
    }).forEach(value => {
        films.innerHTML += getElement(value)
    })

    pages.innerHTML = ""

    for (let i = 1; i <= MAX_PAGE; i++) {
        pages.innerHTML += `<div onclick="change(${i})" ${i === PAGE ? 'class="select"' : ''}>${i}</div>`
    }
}

function getElement(value) {
    if (value.type === "serie")
        return getSerie(value)
    return getFilm(value)
}

function getSerie(value) {
    return `<div class="element" ${value.backdrop_path !== null ? 'style="background-image: url(\'https://image.tmdb.org/t/p/w780' + value.backdrop_path + '\')"' : ''}>
                <div class="img" ${value.poster_path !== null ? 'style="background-image: url(\'https://image.tmdb.org/t/p/w500' + value.poster_path + '\')"' : ''}></div>
                <div class="infos">
                    <h3>${value.original_name}</h3>
                    <div class="description">
                        ${value.overview}
                    </div>
                </div>
            </div>`
}

function getFilm(value) {
    return `<div class="element" ${value.backdrop_path !== null ? 'style="background-image: url(\'https://image.tmdb.org/t/p/w780' + value.backdrop_path + '\')"' : ''}>
                <div class="img" ${value.poster_path !== null ? 'style="background-image: url(\'https://image.tmdb.org/t/p/w500' + value.poster_path + '\')"' : ''}></div>
                <div class="infos">
                    <h3>${value.original_title}</h3>
                    <div class="description">
                        ${value.overview}
                    </div>
                </div>
            </div>`
}

setTimeout(function () {
    load.classList.add("hidden")
}, 1000)