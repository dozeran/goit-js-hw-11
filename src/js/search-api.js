import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39382109-d071ce59cf94359f9a44c3b97';

export default class SearchApiService {
  constructor() {
    this.searchRequest = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImages() {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          key: API_KEY,
          q: this.searchRequest,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.perPage,
        },
      });

      if (response.data.total === 0) {
        Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return null;
      }

      this.page += 1;
      return response.data;
    } catch (error) {
      Notify.failure(`Oops! Something went wrong! Try reloading the page!`);
      return null;
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchRequest;
  }

  set query(newQuery) {
    this.searchRequest = newQuery;
  }
}
