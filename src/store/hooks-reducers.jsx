export const initState = {
  toggleMenu: false,
  subMenu: 'initializing',
  apiEndpoint: 'https://rfe.th.ivao.aero',
}

export const reducers = (state, action) => {
  switch (action.type) {
    case 'setSubMenu':
      return {...state, subMenu: action.subMenu}
    case 'toggleMenu':
      return {...state, toggleMenu: action.toggleMenu}
    default:
      return {...state}
  }
}
