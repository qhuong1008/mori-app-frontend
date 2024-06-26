import { call, put } from "redux-saga/effects";
import * as bookRequest from "../requests/book";
import * as types from "../../types";
import searchBooksRequest from "../requests/book";
import { useSelector } from "react-redux";
import store from "../../store";
import { stringify } from "postcss";
export function* getAllBooksHandler() {
  try {
    const books = yield call(bookRequest.getAllBooksRequest);
    yield put({
      type: types.GET_BOOKS_SUCCESS,
      books: books.books,
    });
  } catch (e) {
    yield put({ type: types.GET_BOOKS_FAILED, message: e.message });
  }
}

export function* getBooksByCategoryHandler({ payload }) {
  try {
    const books = yield call(bookRequest.findBookByCategoryRequest, payload);
    yield put({
      type: types.GET_BOOKS_BY_CATEGORY_SUCCESS,
      books: books.books,
    });
  } catch (e) {
    yield put({ type: types.GET_BOOKS_BY_CATEGORY_FAILED, message: e.message });
  }
}
export function* getBookByIdHandler({ payload }) {
  try {
    const result = yield call(bookRequest.getBookByIdRequest, payload);
    yield put({
      type: types.GET_BOOK_SUCCESS,
      book: result.book,
    });
  } catch (e) {
    yield put({ type: types.GET_BOOK_FAILED, message: e.message });
  }
}

export function* getReadHistoryHandler({ payload }) {
  try {
    const result = yield call(bookRequest.getReadHistoryRequest, payload);

    yield put({
      type: types.GET_READ_HISTORY_SUCCESS,
      readHistory: result.readHistory.reverse(),
    });
  } catch (e) {
    yield put({ type: types.GET_READ_HISTORY_FAILED, message: e.message });
  }
}

export function* searchBooksHandler({ payload }) {
  let books = store.getState().books.books;
  try {
    let filteredBooks = books.filter((item) => {
      if (
        item.author.toLowerCase().includes(payload.toString()) ||
        item.name.toLowerCase().includes(payload.toString())
      )
        return item;
    });

    yield put({
      type: types.SEARCH_BOOKS_SUCCESS,
      filteredBooks: filteredBooks,
    });
  } catch (e) {
    yield put({ type: types.SEARCH_BOOKS_FAILED, message: e.message });
  }
}

export function* increaseTotalReadHandler({ payload }) {
  try {
    yield call(bookRequest.increaseTotalReadRequest, payload);
    yield put({
      type: types.INCREASE_TOTAL_READ_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: types.INCREASE_TOTAL_READ_FAIL,
      message: e.message,
    });
  }
}

export function* increaseTotalSavedHandler(payload) {
  try {
    const result = yield call(bookRequest.increaseTotalSavedRequest, payload);

    yield put({
      type: types.INCREASE_TOTAL_SAVED_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: types.INCREASE_TOTAL_SAVED_FAIL,
      message: e.message,
    });
  }
}
