import ls from 'local-storage'

export const initState = {
  toggleMenu: false,
  subMenu: 'initializing',
  apiEndpoint: 'https://rfe.th.ivao.aero',
  identity: null,
  token: ls('token'),
  tokenTime: ls('tokenTime'),
  authState: 2,
}

export const reducers = (state, action) => {
  switch (action.type) {
    case 'setIdentity':
      return {...state, identity: action.identity}
    case 'setAuthState':
      return {...state, authState: action.authState}
    case 'setToken':
      return {...state, token: action.token}
    case 'setTokenTime':
      return {...state, tokenTime: action.tokenTime}
    case 'setSubMenu':
      return {...state, subMenu: action.subMenu}
    case 'toggleMenu':
      return {...state, toggleMenu: action.toggleMenu}
    default:
      return {...state}
  }
}
