import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeViews from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //1.loading recipie
    await model.loadRecipe(id);

    //2.rendering recipie
    recipeView.render(model.state.recipe);

    //updating
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};
controlRecipies();

const controlSearchResults = async function () {
  try {
    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    //2)load search results
    await model.loadSearchResults(query);
    //3.redner result
    resultsView.render(model.getSearchResultPage());
    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
};
controlSearchResults();

const controlPagination = function (goToPage) {
  //render results
  resultsView.render(model.getSearchResultPage(goToPage));
  //render pagination buttons
  paginationView.render(model.state.search);
};
controlPagination();

const controlServings = function (newServing) {
  //update the recipe servings (in state)
  model.updateServings(newServing);

  //update the recipeview
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  //3)Render the Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeViews.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeViews.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeViews.toggleWindow();
    }, MODAL_CLOSE);
  } catch (err) {
    console.log(err);
    addRecipeViews.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeViews.addHandlerUpload(controlAddRecipe);
};
init();
