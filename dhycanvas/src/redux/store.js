// src/redux/store.js
import { createStore } from 'redux';
import graphicReducer from './reducers';

const store = createStore(graphicReducer);

export default store;
