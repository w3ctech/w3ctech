/**
 * @file 通用 container
 * @author liuliang<liuliang@w3ctech.com>
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise';
import createSagaMiddleware from 'redux-saga';
import Redbox from 'redbox-react';
import { AppContainer } from 'react-hot-loader';
import { DevTools, SagaMonitor } from '../component/Helper';

const sagaMiddleware = createSagaMiddleware({ sagaMonitor: SagaMonitor });

const CustomErrorReporter = ({ error }) => <Redbox error={error} />;
CustomErrorReporter.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
};

export default ({ reducer, saga }, App, id = 'app') => {
  let enhancer = applyMiddleware(...[sagaMiddleware, promiseMiddleware]);

  if (process.env.NODE_ENV !== 'production') {
    enhancer = compose(
      enhancer,
      DevTools.instrument(),
    );
  }

  const store = createStore(
    reducer,
    enhancer,
  );

  sagaMiddleware.run(saga);

  const render = (Component) => {
    ReactDOM.render(
      <Provider store={store}>
        <AppContainer errorReporter={CustomErrorReporter} warnings>
          <Component />
        </AppContainer>
      </Provider>,
      document.getElementById(id),
    );

    return render;
  };

  render.replaceReducer = newReducer => store.replaceReducer(newReducer);


  return render(App);
};
