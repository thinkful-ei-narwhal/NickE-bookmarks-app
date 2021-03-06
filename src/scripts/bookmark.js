/* eslint-disable no-console */
import $ from 'jquery';
import store from './store';
import api from './apimanager';

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return o;
  }
});

const generateError = function (message) {
  return `
  <section class="error-content">
  <div>
    <img src="https://i.imgur.com/GnyDvKN.png" alt="error image">
    <p>${message}</p>
  </div>
  <div class="error-button">
    <button class="nav-buttons" id="cancel-error">Okay</button>
  </div>
</section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.content-holder').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

function resetVals() {
  console.log('Resetting form values');
  $('#book-title').val('');
  $('#book-link').val('');
  $('#description').val('');
}

function appendStars(element) {
  let starsHtml = '<div class="star-container">';
  for (let i = 0; i < 5; i++) {
    if (i < element.rating) {
      starsHtml += '<i class="fa fa-star"></i>';
    } else {
      starsHtml += '<i class="fa fa-star-o"></i>';
    }
  }
  return starsHtml + '</div>';
}

function generateCollapseHTML(bookId) {
  const bookmark = store.findById(bookId);
  return `<div class="book-item-container">
    <button class="book-item js-collapsed" id="${bookmark.id}">
    <div class="title-container">
      <span class="title">${bookmark.title}</span>
    </div>
    ${appendStars(bookmark)}
    </button>
  </div>`;
}

function generateExpandHTML(bookId) {
  const bookmark = store.findById(bookId);
  return `<div class="book-item-container">
          <div class="enabled">
            <button class="book-item js-selected title-button" id="${bookmark.id}">
              <span class="title">${bookmark.title}</span>
            </button>
            <button class="book-item trash-button" id="${bookmark.id}"><i class="fa fa-trash-o"></i></button>
          </div>
          <section class="item-dropdown">
            <div class="dropdown-info">
              <a id="site-button" href="${bookmark.url}" target="_blank" class="button">Visit Site</a>
              ${appendStars(bookmark)}
            </div>    
            <div class="scroll">
              <span>${bookmark.desc}</span>
            </div>
            <div class="enabled-edit">
              <button class="edit-button" id="${bookmark.id}"><i class="fa fa-pencil-square-o"></i></button>
            </div>
          </section>
        </div>`;
}

function generateBookmarks() {
  const bookMarksArray = [];
  store.bookmarks.forEach(bookmark => {
    if (bookmark.rating >= store.filter) {
      let bookmarkHtml = '';
      if (bookmark.expanded) {
        bookmarkHtml = generateExpandHTML(bookmark.id);
      } else {
        bookmarkHtml = generateCollapseHTML(bookmark.id);
      }
      bookMarksArray.push(bookmarkHtml);
    }
  });
  if (bookMarksArray.length === 0 && parseInt(store.filter) === 0) {
    return '<p>You have no bookmarks :( <br> Click New to get started</p>';
  }
  return bookMarksArray.join('');
}

function setFilterVal(value) {
  if (parseInt(store.filter) === parseInt(value)) {
    return 'selected';
  }
  else {
    return '';
  }
}

function generateBookMarkPageHTML() {
  return `<div class="error-container"></div>
  <div id="button-container">
    <button class="nav-buttons" id="flex-new">
      <i class="fa fa-plus-square-o"></i>
      <span class="icon-span"> New </span>
      <i class="fa fa-bookmark-o"></i>
    </button>

    <div class="nav-buttons" id="filter">
      <span class="icon-span"> Filter For </span>
      <br>
      <select id="filter-options">
        <option value="0" ${setFilterVal(0)}> All Books</option>
        <option value="1" ${setFilterVal(1)}> ★+</option>
        <option value="2" ${setFilterVal(2)}> ★★+</option>
        <option value="3" ${setFilterVal(3)}> ★★★+</option>
        <option value="4" ${setFilterVal(4)}> ★★★★+</option>
        <option value="5" ${setFilterVal(5)}> ★★★★★</option>
      </select>
    </div>
  </div>
  <div id="bookmark-container">${generateBookmarks()}</div>`;
}

function generatePostFormHTML() {
  return `<div class="error-container"></div>
  <form id="bookmark-form-add-bookmark">
<div class="form-link">
  <label>Book Title:</label>
  <input type="text" name="bookTitle" id="book-title" placeholder="Book Title" pattern=".{1,}" required title="1 character minimum">
  <label>Add New Bookmark:</label>
  <input type="url" name="url" id="book-link" placeholder="http://samplelink.code/test">
</div>
<div class="form-rating">
  <span class="star-cb-group">
    <input type="radio" id="rating-5" name="rating" value="5" />
    <label for="rating-5">5</label>
    <input type="radio" id="rating-4" name="rating" value="4" />
    <label for="rating-4">4</label>
    <input type="radio" id="rating-3" name="rating" value="3" />
    <label for="rating-3">3</label>
    <input type="radio" id="rating-2" name="rating" value="2" />
    <label for="rating-2">2</label>
    <input type="radio" id="rating-1" name="rating" value="1" />
    <label for="rating-1">1</label>
  </span>
  <textarea name="description" id="description" placeholder="Add a description (optional)"
    id="description"></textarea>
</div>
<div class="form-buttons">
<input type="reset" value="Cancel" id="cancel" class="cancel-button-add-bookmark nav-buttons">
<input type="submit" value="Create" id="submit" class="nav-buttons">
</div>
</form>`;
}

function generatePatchFormHTML(bookId) {
  const bookmark = store.bookmarks.find(ele => ele.id === bookId);
  return `<div class="link-walkthrough">
  <div class="error-container"></div>
  <span>Updating: ${bookmark.title}</span>
  <i class="fa fa-pencil-square-o"></i>
  </div>
  <form class="bookmark-form-edit-bookmark" id="${bookmark.id}">
<div class="form-rating">
  <span class="star-cb-group">
    <input type="radio" id="rating-5" name="rating" value="5" />
    <label for="rating-5">5</label>
    <input type="radio" id="rating-4" name="rating" value="4" />
    <label for="rating-4">4</label>
    <input type="radio" id="rating-3" name="rating" value="3" />
    <label for="rating-3">3</label>
    <input type="radio" id="rating-2" name="rating" value="2" />
    <label for="rating-2">2</label>
    <input type="radio" id="rating-1" name="rating" value="1" />
    <label for="rating-1">1</label>
  </span>
  <textarea name="description" id="description" placeholder="edit description (optional)"
    id="description"></textarea>
</div>
<div class="form-buttons">
<input type="reset" value="Cancel" id="cancel" class="cancel-button-edit-bookmark nav-buttons">
<input type="submit" value="Update" id="submit" class="nav-buttons">
</div>
</form>`;
}

function render() {
  renderError();
  let renderHTML = '';
  if (store.adding === true) {
    console.log('Rendering add bookmark page');
    renderHTML = generatePostFormHTML();
  }
  else if (store.editingId !== '0') {
    console.log('Rendering update page');
    renderHTML = generatePatchFormHTML(store.editingId);
  }
  else {
    console.log('Rendering my bookmarks page');
    renderHTML = generateBookMarkPageHTML();
  }
  $('.content-holder').html(renderHTML);
}

function handleExpand() {
  $('.content-holder').on('click', '.js-collapsed', function (event) {
    event.preventDefault();
    const bookId = this.id;
    store.setExpandedBookmark(bookId);
    render();
  });
}

function handleCollapse() {
  $('.content-holder').on('click', '.title-button', function (event) {
    event.preventDefault();
    const bookId = this.id;
    store.setExpandedBookmark(bookId);
    render();
  });
}

function handleFilterByOptions() {
  $('.content-holder').on('change', '#filter-options', function (event) {
    event.preventDefault();
    store.bookmarks.forEach(() => store.setExpandedBookmark());
    const filterVal = $(this).val();
    store.setFilterLevel(filterVal);
    render();
  });
}

function handleNew() {
  $('.content-holder').on('click', '#flex-new', function (event) {
    event.preventDefault();
    store.setExpandedBookmark();
    store.toggleAddingBookmark();
    render();
  });
}

function handleSubmitBookmarkAdd() {
  $('.content-holder').on('submit', '#bookmark-form-add-bookmark', function (event) {
    event.preventDefault();
    console.log('Submitting new bookmark');
    let eventObj = $(event.target).serializeJson();
    const title = eventObj.bookTitle;
    let url = eventObj.url;
    let desc = eventObj.description;
    let rating = eventObj.rating;

    if (!url.startsWith('https://') || !url.startsWith('http://')) {
      url = 'https://' + url;
    }

    if (typeof (desc) === 'undefined' || desc === '') {
      desc = 'No description. Be the first to describe it by clicking the edit pen.';
    }

    //this will force an error because the post cannot handle anything between 1-5, but can handle nulls and undefined
    if (rating === null || rating === undefined) {
      rating = 0;
    }

    api.postBookmark(title, url, desc, rating)
      .then(dataResponse => {
        resetVals();
        store.setError(null);
        store.setFilterLevel(0);
        store.toggleAddingBookmark();
        store.setExpandedBookmark();
        store.addBookmark({
          id: dataResponse.id,
          title: dataResponse.title,
          rating: dataResponse.rating,
          url: dataResponse.url,
          desc: desc,
          expanded: false
        });
        console.log(store.bookmarks);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
}

function handleCancelBookmarkAdd() {
  $('.content-holder').on('click', '.cancel-button-add-bookmark', function (event) {
    event.preventDefault();
    console.log('Canceling add bookmark');
    resetVals();
    store.toggleAddingBookmark();
    store.setExpandedBookmark();
    store.setError(null);
    render();
  });
}

function handleEdit() {
  $('.content-holder').on('click', '.edit-button', function (event) {
    event.preventDefault();
    const bookId = this.id;
    store.setEditingBookmark(bookId);
    render();
  });
}

function handleSubmitBookmarkUpdate() {
  $('.content-holder').on('submit', '.bookmark-form-edit-bookmark', function (event) {
    event.preventDefault();
    console.log('Updating bookmark');
    const bookId = this.id;
    let eventObj = $(event.target).serializeJson();
    let description = eventObj.description;
    let rating = eventObj.rating;

    if (typeof (description) === 'undefined' || description === '') {
      description = 'No description. Be the first to describe it by clicking the edit pen.';
    }

    //this will force an error because the post cannot handle anything between 1-5, but can handle nulls and undefined
    if (rating === null || rating === undefined) {
      rating = 0;
    }

    api.patchBookmark(bookId, description, rating)
      .then(() => {
        resetVals();
        store.setError(null);
        store.setFilterLevel(0);
        store.setEditingBookmark();
        store.setExpandedBookmark();
        store.findAndUpdate(bookId, { rating, desc: description });
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
}

function handleCancelBookmarkUpdate() {
  $('.content-holder').on('click', '.cancel-button-edit-bookmark', function (event) {
    event.preventDefault();
    console.log('Canceling Update bookmark');
    resetVals();
    store.setEditingBookmark();
    store.setError(null);
    store.setExpandedBookmark();
    render();
  });
}

function handleTrash() {
  $('.content-holder').on('click', '.trash-button', function (event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this item?')) {
      const bookId = this.id;
      api.deleteBookmark(bookId)
        .then(() => {
          store.findAndDelete(bookId);
          render();
        })
        .catch((error) => {
          store.setError(error.message);
          renderError();
        });
    }
  });
}

const handleEventListeners = function () {
  handleExpand();
  handleCollapse();
  handleTrash();
  handleNew();
  handleEdit();
  handleFilterByOptions();
  handleSubmitBookmarkAdd();
  handleCancelBookmarkAdd();
  handleSubmitBookmarkUpdate();
  handleCancelBookmarkUpdate();
  handleCloseError();
};

export default {
  handleEventListeners,
  render,
  renderError
};