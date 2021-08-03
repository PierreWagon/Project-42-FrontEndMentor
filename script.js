// +++ Initializing BVselect plugin
document.addEventListener("DOMContentLoaded", function() {
    let regionSelect = new BVSelect({
      selector: "#region",
      width: "100%",
      searchbox: false,
      offset: true,
      placeholder: "Filter by Region",
      breakpoint: 200
    });

    // +++ Checks when a region filter is used
    const Regions = document.querySelectorAll('.bv_mainselect ul li');
    Regions.forEach(region => {
        region.addEventListener('click', e => {
            filterByRegion(region.innerText.trim());
            searchBar.value = "";

            setTimeout( function() {
                document.querySelectorAll('.country').forEach(country => {
                    country.addEventListener('click', e => {
                        //console.log(country.querySelector('.name').innerText.trim());
                        searchByName(country.querySelector('.name').innerText.trim());
                        document.querySelector('.country-details').style.display = "block";
                        document.querySelector("body").classList.add('details-active');
                        window.scrollTo(0,0);
                    })
                })
            }, 200)
        })
    })

});


// +++ Creates a country card
function createCountryCard() {
    const putCardHere = document.querySelector('.countries-wrapper');
    const newCard = document.createElement("div");
    newCard.className = 'country';
    newCard.innerHTML = "\<div class=\"country-img\"\>\<\/div\> \<div class=\"country-info\"\> \<p class=\"name\"\>\<\/p\> \<p\> Population: \<span class=\"population\"\>\<\/span\>\<\/p\> \<p\> Region: \<span class=\"region\"\>\<\/span\>\<\/p\> \<p\> Capital: <\span class=\"capital\"\>\<\/span\>\<\/p\> \<\/div\> \<\/div\>";
    putCardHere.appendChild(newCard);
}

// +++ Fills country card with informations
function fillCountryCard(response) {
    document.querySelector('.country-img').style.backgroundImage = "url(" + response.flag + ")";
    document.querySelector('.name').innerHTML = response.name;
    document.querySelector('.population').innerHTML = response.population;
    document.querySelector('.region').innerHTML = response.region;
    document.querySelector('.capital').innerHTML = response.capital;
}

function fillCountryCardLoop(response, index) {
    const countriesImg = document.querySelectorAll('.country-img');
    const countriesName = document.querySelectorAll('.name');
    const countriesPop = document.querySelectorAll('.population');
    const countriesRegion = document.querySelectorAll('.region');
    const countriesCapital = document.querySelectorAll('.capital');

    countriesImg[index].style.backgroundImage = "url(" + response[index].flag + ")";
    countriesName[index].innerHTML = response[index].name;
    countriesPop[index].innerHTML = response[index].population;
    countriesRegion[index].innerHTML = response[index].region;
    countriesCapital[index].innerHTML = response[index].capital;
}

// +++ Delete all cards
function deleteCards() {
    let countryCards = document.querySelectorAll('.country');
    countryCards.forEach(card => {
        card.remove();
    })
}

// +++ Filtering by region
function filterByRegion(region) {
    deleteCards();
    if (region == "Worldwide") { //If "Worldwide" is selected, just displays all countries
        fetch('https://restcountries.eu/rest/v2/all')
        .then(response => response.json())
        .then( function(response) {
            for (let i=0; i<response.length; i++) {
                createCountryCard();
                fillCountryCardLoop(response, i);
            }
            
        })
    }
    else {
        fetch('https://restcountries.eu/rest/v2/region/' + region)
        .then(response => response.json())
        .then( function(response) {
            for (let i=0; i<response.length; i++) {
                createCountryCard();
                fillCountryCardLoop(response, i);
            }
        })
    }
}

// +++ Filtering with search bar 
let countryNames = document.querySelectorAll('.country .name');
function filterByName(searchValue) {
    countryNames.length = 0;
    countryNames = document.querySelectorAll('.country .name');
    countryNames.forEach(country => {
        if (country.innerText.trim().toUpperCase().includes(searchValue.toUpperCase())) {
            country.parentNode.parentNode.style.display = "block";
        }
        else {
            country.parentNode.parentNode.style.display = "none";
        }
    })
}

// +++ Search bar EventListener
const searchBar = document.getElementById('country-search');
searchBar.addEventListener('input', e => {
    filterByName(searchBar.value);
})

// +++ Calls the API on page load to get all countries
document.addEventListener("DOMContentLoaded", function() {
    fetch('https://restcountries.eu/rest/v2/all')
    .then(response => response.json())
    .then( function(response) {
        for (let i=0; i<response.length; i++) {
            createCountryCard();
            fillCountryCardLoop(response, i);
        }
    })
});


// +++ Searching for a country by name - Used to display detailed research
function searchByName(name) {
    fetch('https://restcountries.eu/rest/v2/name/' + name)
    .then(response => response.json())
    .then (function(response) {
        document.querySelector('.big-country-img').style.backgroundImage = "url(" + response[0].flag + ")";
        document.querySelector('.big-name').innerHTML = response[0].name;
        document.querySelector('.big-native-name').innerHTML = response[0].nativeName;
        document.querySelector('.big-population').innerHTML = response[0].population;
        document.querySelector('.big-region').innerHTML = response[0].region;
        document.querySelector('.big-sub-region').innerHTML = response[0].subregion;
        document.querySelector('.big-capital').innerHTML = response[0].capital;
        document.querySelector('.big-domain').innerHTML = response[0].topLevelDomain;


        let currencies = "";
        response[0].currencies.forEach(currency => {
            //document.querySelector('.big-currencies').innerHTML = document.querySelector('.big-currencies').innerHTML + ", " + currency.name;
            currencies = currencies + ", " + currency.name;
        })
        document.querySelector('.big-currencies').innerHTML = currencies.substring(1); /*Substring deletes the first comma*/
        
        let languages = "";
        response[0].languages.forEach(language => {
            languages = languages + ", " + language.name;
        })
        document.querySelector('.big-languages').innerHTML = languages.substring(1);
        
        let borderCountries = "";
        // Checks if country has borders, convert their ISO code to their name is so, or display "None" if not
        if (response[0].borders == "") {
            document.querySelector('.big-border-countries').innerHTML = "None";
        }
        else {
            response[0].borders.forEach(borderCountry => {
                fetch('https://restcountries.eu/rest/v2/alpha/' + borderCountry)
                .then(response => response.json())
                .then (function(response) {
                    borderCountries = borderCountries + "\<span class=\"border-country\"\>" +  response.name /*borderCountry*/ + "\<\/span\>";
                    document.querySelector('.big-border-countries').innerHTML = borderCountries;
                })
            })
        }
    })
    // Allows user to click on a border country's name to display it
    setTimeout( function() {
        borderCountries = document.querySelectorAll('.border-country');
        borderCountries.forEach(border => {
            border.addEventListener('click', e => {
                searchByName(border.innerHTML.trim());
            })
        })
    }, 1000)
}

// Converts an ISO country code to its name (e.g FRA -> France)
function convertCountryCodeToName(code) {
    fetch('https://restcountries.eu/rest/v2/alpha/' + code)
    .then(response => response.json())
    .then (function(response) {
        console.log("response = " + response.name);
        return response.name;
    })
}

// +++ EventListener on countries - Get details when clicked on
let borderCountries = document.querySelectorAll('.border-country');
setTimeout( function() {
    document.querySelectorAll('.country').forEach(country => {
        country.addEventListener('click', e => {
            //console.log(country.querySelector('.name').innerText.trim());
            searchByName(country.querySelector('.name').innerText.trim());
            document.querySelector('.country-details').style.display = "block";
            document.querySelector("body").classList.add('details-active');
            window.scrollTo(0,0);
        })
    })
}, 200)


// +++ Hides the details modal when clicking on "<- Back" button
document.querySelector('.back-btn').addEventListener('click', e => {
    document.querySelector('.country-details').style.display = "none";
    document.querySelector("body").classList.remove('details-active');
})