import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import ls from 'local-storage'
import moment from 'moment'
import qs from 'query-string'

import {appContext, Loading, Axios} from '../bridge'

import {Row, Col, Card, Typography, Button} from 'antd'

const {Title} = Typography

const Auth = props => {
  const dispatch = useContext(appContext)

  const {store} = props

  useEffect(() => {
    dispatch({type: 'setSubMenu', subMenu: 'auth'})

    if (store.authState === 2) {
      const params = qs.parse(props.location.search, {ignoreQueryPrefix: true})
      if (params.IVAOTOKEN) {
        const token = params.IVAOTOKEN
        const time = moment()
        ls('token', token)
        ls('tokenTime', time)
        dispatch({type: 'setToken', token})
        dispatch({type: 'setTokenTime', time})
      }

      if (store.token === null) {
        // Case init
        dispatch({type: 'setAuthState', authState: 3})
      } else if (moment().diff(moment(store.tokenTime)) >= 604800000) {
        // Case token expired
        dispatch({type: 'setAuthState', authState: 4})
        ls('token', null)
        ls('tokenTime', null)
        dispatch({type: 'setToken', token: null})
        dispatch({type: 'setTokenTime', tokenTime: null})
      } else {
        dispatch({type: 'setAuthState', authState: 6})
        ;(async () => {
          const out = await Axios.get(`${store.apiEndpoint}/api/v1/token/fetch/${store.token}`)
          if (out.data.response.data.token.result === 0) {
            // Rouge token
            dispatch({type: 'setAuthState', authState: 5})
            ls('token', null)
            ls('tokenTime', null)
            dispatch({type: 'setToken', token: null})
            dispatch({type: 'setTokenTime', tokenTime: null})
          } else {
            dispatch({type: 'setAuthState', authState: 1})
          }
        })()
      }
    }
  }, [dispatch, props, store])

  return (
    <Row>
      <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}} lg={{span: 8, offset: 8}}>
        <Card>
          <Title level={2}>
            {store.authState === 2 || store.authState === 6
              ? `Authenticating`
              : store.authState === 3
              ? `Login`
              : store.authState === 1
              ? `Success`
              : `Failed`}
          </Title>
          {store.authState === 2 || store.authState === 6 ? (
            <Loading />
          ) : store.authState === 3 ? (
            <p>Please login by clicking button below</p>
          ) : store.authState === 4 ? (
            <p>Login expired</p>
          ) : store.authState === 5 ? (
            <p>Invalid login token! Please login again.</p>
          ) : null}
          {store.authState === 2 || store.authState === 6 ? null : (
            <a href="http://login.ivao.aero/index.php?url=https://rfe.th.ivao.aero">
              <Button block type="primary">
                Login
              </Button>
            </a>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default withRouter(Auth)

Auth.propTypes = {
  store: PropTypes.object,
  location: PropTypes.object,
}
