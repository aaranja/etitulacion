import {configureStore} from "@reduxjs/toolkit";
// import {middleware} from "./api/catalogApi";
import {setupListeners} from "@reduxjs/toolkit/query/react";
import rootReducer from "./rootReducer";
import {auth} from "./services/auth";


const store = configureStore({
    reducer: rootReducer, middleware: (gDM) => gDM().concat(auth.middleware),
})

setupListeners(store.dispatch)
export default store;