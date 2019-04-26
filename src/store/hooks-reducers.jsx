export const initState = {
  toggleMenu: false,
  apiEndpoint: 'https://rfe.th.ivao.aero',
}

export const reducers = (state, action) => {
  switch (action.type) {
    case 'toggleMenu':
      return {...state, toggleMenu: action.toggleMenu}
    default:
      return {...state}
  }
}
