import View from './view.js';
import icons from '../../img/icons.svg';

//this View generates the pagination buttons showing 10 recipiec on every page
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //page 1 +
    if (currentPage === 1 && numPages > 1) {
      return `<button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-right"></use>
                </svg>
              </button>`;
    }
    //page 1
    if (currentPage === 1 && numPages === 1) return;

    //page !==1
    if (currentPage < numPages) {
      return `<button data-goto="${
        currentPage - 1
      }"class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      <button data-goto="${
        currentPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
    }
    //last page
    if (currentPage === numPages && numPages > 1) {
      return `<button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      `;
    }
  }
}

export default new PaginationView();
