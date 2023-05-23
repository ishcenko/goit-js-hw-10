import './css/styles.css';

import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const listEl = document.querySelector('.country-list');
const cardEl = document.querySelector('.country-info');
const inputSearchBoxEl = document.querySelector('#search-box');

inputSearchBoxEl.addEventListener(
  'input',
  debounce(onFetchCountries, DEBOUNCE_DELAY)
);

function onFetchCountries(evt) {
  console.log(evt.target.value);
  let nameCountry = evt.target.value.trim();
  if (nameCountry === '') {
    clearAll();
    return;
  }
  fetchCountries(nameCountry)
    .then(result => {
      console.log(result.length);
      if (result.length > 10) {
        clearAll();
        return tooManyCountries(result);
      }
      if (result.length === 1) {
        const markup = markupCard(result);
        return updateCard(markup);
      }
      if ((result.length >= 2) & (result.length <= 10)) {
        const markup = markupList(result);
        return updateList(markup);
      }
    })

    .catch(err => {
      clearAll();
      console.log(err);
      console.log(err.message);
      if (err.message === 'Not Found') {
        return onError();
      }
      Notify.failure(err.message);
    });
}
console.log(fetchCountries);
function onError(err) {
  Notify.failure('Oops, there is no country with that name');
}
function tooManyCountries(result) {
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function markupList(arrCountries) {
  return arrCountries
    .map(
      ({
        name: { official },
        flags: { svg, alt },
      }) => `<li class='country-list-item'>
    <img class='flag-icon' src='${svg}' alt='${alt}' height='60'>
    <h2 class='country-list-title'>${official}</h2>
  </li>`
    )
    .join('');
}

function markupCard(arrCountries) {
  return arrCountries
    .map(
      ({
        name: { official },
        flags: { svg, alt },
        capital,
        population,
      }) => `<div class='country-info-title'><img src='${svg}' alt='${alt}' height='60'>
  <h1>${official}</h1></div>
  <ul class='list country-info-list'>
    <li>Capital: ${capital}</li>
    <li>Population: ${population}</li>
    <li>Languages: ${Object.values(arrCountries[0].languages).join(', ')}</li>
  </ul>`
    )
    .join('');
}

function updateCard(markup) {
  cardEl.innerHTML = markup;
  listEl.innerHTML = '';
}

function updateList(markup) {
  listEl.innerHTML = markup;
  cardEl.innerHTML = '';
}

function clearAll() {
  listEl.innerHTML = '';
  cardEl.innerHTML = '';
}