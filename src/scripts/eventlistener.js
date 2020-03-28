/* eslint-disable no-console */
import cuid from 'cuid';
import $ from 'jquery';
import store from './store';
import api from './apimanager';

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
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
              <span>${bookmark.description}</span>
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
  return `<form id="bookmark-form-add-bookmark">
<div class="form-link">
  <label>Book Title:</label>
  <input type="text" id="book-title" placeholder="Book Title">
  <label>Add New Bookmark:</label>
  <input type="text" id="book-link" placeholder="http://samplelink.code/test">
</div>
<div class="form-rating">
<div class="error-container"></div>
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
<input type="reset" value="Cancel" id="cancel" class="cancel-button-add-bookmark">
<input type="submit" value="Create" id="submit">

</form>`;
}

function generatePatchFormHTML(bookId) {
  const bookmark = store.bookmarks.find(ele => ele.id === bookId);
  return `<div class="link-walkthrough">
  <span>Updating: ${bookmark.title}</span>
  <i class="fa fa-pencil-square-o"></i>
  </div>
  <form class="bookmark-form-edit-bookmark" id="${bookmark.id}">
  <div class="error-container"></div>
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
<input type="reset" value="Cancel" id="cancel" class="cancel-button-edit-bookmark">
<input type="submit" value="Update" id="submit">
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

//Needs more error catching on invalid input fields
function handleSubmitBookmarkAdd() {
  $('.content-holder').on('submit', '#bookmark-form-add-bookmark', function (event) {
    event.preventDefault();
    console.log('Submitting new bookmark');
    const title = $('#book-title').val();
    const linkUrl = $('#book-link').val();
    let description = $('#description').val();
    const rating = $('input[name="rating"]:checked').val();

    //NOTE: REINSTATE THIS WHEN YOU HAVE REAL ERROR HANDLING WORKING
    //checks work for both create and edit
    // if (title === '') { //Needs to be handled with API calls, need to take out internal function
    //   storefunctions.storeError('Enter a book title');
    //   internalfunctions.showErrorPopup(true);
    //   return;
    // } else if (linkUrl === '') {  //Needs to be handled with API calls, need to take out internal function
    //   storefunctions.storeError('Enter a book url');
    //   internalfunctions.showErrorPopup(true);
    //   return;
    // } else if (typeof rating === 'undefined') {  //Needs to be handled with API calls, need to take out internal function
    //   storefunctions.storeError('Rating required');
    //   internalfunctions.showErrorPopup(true);
    //   return;
    // }

    if (typeof (description) === 'undefined') {
      description = '';
    }

    api.postBookmark(title, linkUrl, description, rating)
      .then(() => {
        resetVals();
        store.setError(null);
        store.setFilterLevel(0);
        store.toggleAddingBookmark();
        store.setExpandedBookmark();
        store.addBookmark({
          id: cuid(),
          title: title,
          rating: rating,
          url: linkUrl,
          description: description,
          expanded: false
        });
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

//Needs more error catching on invalid input fields
function handleSubmitBookmarkUpdate() {
  $('.content-holder').on('submit', '.bookmark-form-edit-bookmark', function (event) {
    event.preventDefault();
    console.log('Updating bookmark');
    let description = $('#description').val();
    const rating = $('input[name="rating"]:checked').val();
    const bookId = this.id;

    if (typeof (description) === 'undefined') {
      description = '';
    }

    api.patchBookmark(bookId, description, rating)
      .then(() => {
        resetVals();
        store.setError(null);
        // internalfunctions.showErrorPopup(false);
        store.setFilterLevel(0);
        store.setEditingBookmark();
        store.findAndUpdate(bookId, {
          rating: rating,
          description: description,
        });
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