import React from 'react'
import {NavLink, Link, Redirect} from 'react-router-dom'
import Loadable from 'react-loadable'
import Axios from 'axios'
import {Helmet} from 'react-helmet'
import Loading from './components/loading'

const appContext = React.createContext(null)

export {appContext, NavLink, Link, Loading, Redirect, Loadable, Axios, Helmet}
