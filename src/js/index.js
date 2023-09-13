import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SearchApiService from './search-api';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const searchApiService = new SearchApiService();

loadMoreButton.style.display = 'none';

form.addEventListener('submit', searchImages);
loadMoreButton.addEventListener('click', onMoreClick);

async function searchImages(e) {
  e.preventDefault();

  searchApiService.query = e.currentTarget.elements.searchQuery.value;

  if (searchApiService.query === '') {
    return Notify.failure(`Oops! Empty Request!`);
  }

  searchApiService.resetPage();
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';

  try {
    const searchData = await searchApiService.fetchImages();

    if (searchData) {
      Notify.success(`Hooray! We found ${searchData.totalHits} images.`);

      renderGallery(searchData);

      if (searchData.totalHits > searchApiService.perPage) {
        loadMoreButton.style.display = 'block';
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function onMoreClick() {
  try {
    const searchData = await searchApiService.fetchImages();

    if (!searchData) return;

    let allPages = Math.ceil(searchData.totalHits / searchApiService.perPage);
    if (allPages < searchApiService.page) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMoreButton.style.display = 'none';
    }

    renderGallery(searchData);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.error(error);
  }
}

function renderGallery(searchData) {
  if (!searchData) {
    gallery.innerHTML = '';
  }
  console.log(searchData);
  const markup = searchData.hits
    .map(
      item => `
      <div class="photo-card">
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="350" height="214" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b><br>${item.likes}
          </p>
          <p class="info-item">
            <b>Views</b><br>${item.views}
          </p>
          <p class="info-item">
            <b>Comments</b><br>${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b><br>${item.downloads}
          </p>
        </div>
      </div>
        `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

var lightbox = new SimpleLightbox('.gallery a');
