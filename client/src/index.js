import React from "react";
import { render } from "react-dom";
import "./Base.css";
import App from "./App";
import { createStore, applyMiddleware, compose} from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers/";
import thunk from "redux-thunk";
import multi from "redux-multi";
import { logger } from "redux-logger";
import { persistStore, } from 'redux-persist'
import { PersistGate } from "redux-persist/lib/integration/react";
import storage from 'redux-persist/lib/storage'

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, multi, logger)
)


const persistConfig = {
    key: 'root',
    storage: storage,
  }

let persistor = persistStore(store);


//const persistedReducer = persistReducer(persistConfig, rootReducer);

//import registerServiceWorker from './registerServiceWorker'; TODO remove?
//import stonpmreFactory from './store'

//const store = storeFactory();
//const store = createStore(rootReducer, applyMiddleware(thunk, multi, logger));

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

//registerServiceWorker();
