import React, {useReducer} from 'react'
import ReactDOM from 'react-dom'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import {appContext, Loadable, Loading, Helmet} from './bridge'

import {reducers, initState} from './store/hooks-reducers'

import App from './components/app'

import 'antd/dist/antd.css'

const Home = Loadable({
  loader: () => import('./pages/home' /* webpackChunkName: "home" */),
  loading: Loading,
})

const Event = Loadable({
  loader: () => import('./pages/event' /* webpackChunkName: "event" */),
  loading: Loading,
})

const Error = Loadable({
  loader: () => import('./pages/error' /* webpackChunkName: "error" */),
  loading: Loading,
})

const Root = () => {
  const [state, dispatch] = useReducer(reducers, initState)

  return (
    <Router>
      <Helmet defaultTitle="IVAOTH RFE" titleTemplate="%s · IVAOTH RFE">
        <style>
          {`body {
              background-color: #f0f2f5;
            }`}
        </style>
      </Helmet>
      <appContext.Provider value={dispatch}>
        <App store={state}>
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <appContext.Provider key={0} value={dispatch}>
                  <Home store={state} />
                </appContext.Provider>
              )}
            />

            <Route
              path="/event/:id"
              render={() => (
                <appContext.Provider key={1} value={dispatch}>
                  <Event store={state} />
                </appContext.Provider>
              )}
            />

            <Route exact component={Error} />
          </Switch>
        </App>
      </appContext.Provider>
    </Router>
  )
}

ReactDOM.render(<Root />, document.getElementById('ivaothai-rfe'))
