import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/'
import thunk from "redux-thunk"
import multi from 'redux-multi'
import { logger } from 'redux-logger'

//import registerServiceWorker from './registerServiceWorker'; TODO remove?
//import stonpmreFactory from './store'

//const store = storeFactory();
const store = createStore(
    rootReducer,
    applyMiddleware(thunk, multi, logger)
)

render(
    <Provider store={store}>
        <App />
    </Provider>, document.getElementById('root'));

//registerServiceWorker();
