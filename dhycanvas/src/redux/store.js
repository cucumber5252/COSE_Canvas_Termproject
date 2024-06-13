// redux/store.js
import { createStore } from "redux";
import graphicReducer from "./reducers";

// Redux 스토어를 생성
const store = createStore(graphicReducer);

export default store;
