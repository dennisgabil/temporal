// import { createStore, applyMiddleware, compose } from 'redux';
// import singleReducer from './redux/index';
// import { thunk } from 'redux-thunk';

// const store = createStore(
// 	singleReducer,
// 	compose (applyMiddleware(thunk),
// 		window.devToolsExtension? window.devToolsExtension(): f => {return f})
// );

// export default store;

import { applyMiddleware, compose, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import monitorReducersEnhancer from './enhancers/monitorReducers';
import loggerMiddleware from './middleware/logger';
import rootReducer from './redux';

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunk]
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
  const composedEnhancers = compose(...enhancers)

  const store = createStore(rootReducer, preloadedState, composedEnhancers)

  return store
}