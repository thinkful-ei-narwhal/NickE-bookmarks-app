import $ from 'jquery';
import './styles/index.css';
import store from './scripts/store';
import bookmark from './scripts/bookmark';
import api from './scripts/apimanager';

function main() {
  api.getBookmarks()
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      bookmark.render();
    }).catch((error) => {
      store.setError(error.message);
      bookmark.renderError();
    });
  bookmark.handleEventListeners();
  bookmark.render();
}

$(main);