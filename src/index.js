import $ from 'jquery';
import './styles/index.css';
import store from './scripts/store';
import eventListener from './scripts/eventlistener';
import api from './scripts/apimanager';

function main() {
  api.getBookmarks()
    .then((items) => {
      items.forEach((item) => store.addBookmark(item));
      eventListener.render();
    }).catch((error) => {
      store.setError(error.message);
      eventListener.renderError();
    });
  eventListener.handleEventListeners();
  eventListener.render();
}

$(main);