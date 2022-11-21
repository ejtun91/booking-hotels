import { combineReducers } from "redux";
import { authReducer } from "./auth";

//COMBINE REDUCERS
const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
