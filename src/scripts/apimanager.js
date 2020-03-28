/* eslint-disable no-console */
const baseUrl = 'https://thinkful-list-api.herokuapp.com/nick';
const bookmarkResource = '/bookmarks';
const urlBookmarks = baseUrl + bookmarkResource;

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};

function getBookmarks() {
  console.log('Getting bookmarks');
  return listApiFetch(urlBookmarks);
}

function postBookmark(titleBook, urlBook, descBook, ratingBook) {
  const data = {
    'title': `${titleBook}`,
    'url': `${urlBook}`,
    'desc': `${descBook}`,
    'rating': `${ratingBook}`
  };
  const requestObj = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  console.log('Posting new book: ' + data);
  return listApiFetch(urlBookmarks, requestObj);
}

function patchBookmark(bookId, descBook, ratingBook) {
  const data = {
    'desc': `${descBook}`,
    'rating': `${ratingBook}`
  };
  const requestObj = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
  console.log('Patching book: ' + bookId);
  return listApiFetch(urlBookmarks + '/' + bookId, requestObj);
}

function deleteBookmark(id) {
  console.log('Deleting book: ' + id);
  return listApiFetch(urlBookmarks + '/' + id, { method: 'delete' });
}

export default {
  getBookmarks,
  postBookmark,
  patchBookmark,
  deleteBookmark
};