import React, {useEffect, useContext} from 'react'
import ls from 'local-storage'

import {appContext, Loading} from '../bridge'

import {Row, Col} from 'antd'

const Logout = props => {
  const dispatch = useContext(appContext)

  useEffect(() => {
    dispatch({type: 'setSubMenu', subMenu: 'logout'})

    ls('token', null)
    ls('tokenTime', null)
    dispatch({type: 'setToken', token: null})
    dispatch({type: 'setTokenTime', tokenTime: null})

    dispatch({type: 'setAuthState', authState: 3})
  }, [dispatch, props])

  return (
    <Row>
      <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}} lg={{span: 8, offset: 8}}>
        <Loading />
      </Col>
    </Row>
  )
}

export default Logout
