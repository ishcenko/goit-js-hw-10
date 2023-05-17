import './css/styles.css';
import { searchCountry } from './search';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
    countryList: document.querySelector('.country-list'),
    searchBox: document.querySelector('#search-box'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(fetchCalls, DEBOUNCE_DELAY));

function fetchCalls() {
    const nameCounrty = refs.searchBox.value.trim();
    if (nameCounrty === '') {
        clearList();
        return;
    }
    clearList();

    searchCountry(nameCounrty).then(countries => {
        if (countries.length === 0) {
            clearTheList();
        } else if (countries.length >= 10) {
            responseWarning();
        } else if (countries.length > 1 && countries.length < 10) {
            multipleCountriesList(countries);
        } else {
            oneCountry(countries[0]);
        }
    })
        .catch(clearTheList);
}
function multipleCountriesList(countries) {
    const listMarkup = countries.map(
        ({ flags, name }) => `<div class="list__item"><img src="${flags.svg}" width="35" height="25"><li>${name.common}</li></ul></div>`
    ).join('');
    refs.countryList.innerHTML = listMarkup;
}

function oneCountry({ flags, name, capital, population, languages }) {
    const listMarkup = `<div class="list__item"><img class=""flag-img" src="${
    flags.svg
  }" width="50" height="30">
      <h2 class="title-country">${name.common}</h2>
      <p class="capital-country"><span class="capital-data">Capital: </span>${capital}</p>
      <p class="capital-country"><span class="data-value">Population: </span>${population}</p>
      <p class="capital-country"><span class="language-country">Languages: </span>${Object.values(
        languages
      ).join(', ')}</p></div>`;

  refs.countryList.innerHTML = listMarkup;
}

function clearTheList() {
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    position: 'right-top',
    timeout: 2000,
  });
}

function responseWarning() {
  Notiflix.Notify.warning(
    'Too many matches found. Please enter a more specific name.',
    {
      position: 'right-top',
      timeout: 2000,
    }
  );
}

function clearList() {
  refs.countryList.innerHTML = '';
}