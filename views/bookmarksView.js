import View from './view.js';
import PreviewView from './previewView.js';
import icons from '../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet!';
  _message;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup(result) {
    return this._data.map(p => PreviewView.render(p, false)).join('');
  }
}

export default new BookmarksView();
