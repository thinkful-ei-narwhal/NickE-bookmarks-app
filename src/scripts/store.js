/* eslint-disable no-console */

//store ex for reference
// export const store = {
//   bookmarks: [
//     {
//       id: cuid(),
//       title: 'Name of the Wind',
//       rating: 5,
//       url: 'http://www.title1.com',
//       description: 'Literally the best book you\'ll ever read',
//       expanded: false
//     },
//   ],
//   adding: false,
//   editing: '0',
//   error: null,
//   filter: 0
// };

const bookmarks = [];
let error = null;
let adding = false;
let editingId = '0';
let filter = 0;

const findById = function (id) {
  return this.bookmarks.find(bookmark => bookmark.id === id);
};

const addBookmark = function (currentBookmark) {
  this.bookmarks.push(currentBookmark);
};

const findAndUpdate = function (id, newData) {
  const currentBookmark = this.findById(id);
  Object.assign(currentBookmark, newData);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const setExpandedBookmark = function (id = 0) {
  if (parseInt(id) === 0) {
    this.bookmarks.forEach(currentBookmark => currentBookmark.expanded = false);
  }
  else {
    this.bookmarks.forEach(currentBookmark => {
      if (currentBookmark.id === id) {
        currentBookmark.expanded = !currentBookmark.expanded;
      }
    });
  }
};

const toggleAddingBookmark = function () {
  this.adding = !this.adding;
};

const setEditingBookmark = function (editingId = '0') {
  this.editingId = editingId;
};

const setFilterLevel = function (filterLevel) {
  this.filter = parseInt(filterLevel);
};

const setError = function (error) {
  this.error = error;
};

export default {
  bookmarks,
  adding,
  editingId,
  filter,
  error,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  toggleAddingBookmark,
  setExpandedBookmark,
  setEditingBookmark,
  setFilterLevel,
  setError
};