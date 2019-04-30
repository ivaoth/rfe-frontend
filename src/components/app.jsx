import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {appContext, Helmet} from '../bridge'

import Nav from './nav'

import {Layout, Row, Col, Divider, Typography} from 'antd'

const {Content, Footer} = Layout
const {Title, Text} = Typography

const App = props => {
  const {children, store} = props

  const dispatch = useContext(appContext)

  return (
    <>
      <Helmet title={store.subMenu} />
      <Layout>
        <Content style={{padding: '0 25px'}}>
          <Row style={{marginTop: '60px', marginBottom: '5px'}} type="flex" justify="space-between" align="bottom">
            <Col span={22}>
              <Title style={{fontSize: '38px', fontWeight: '700', marginBottom: '0px', display: 'inline-block'}}>
                IVAOTH RFE
              </Title>
              <Title level={3} style={{display: 'inline', color: 'rgba(0, 0, 0, 0.45)'}}>
                {store.subMenu}
              </Title>
            </Col>
            {store.authState === 1 ? (
              <appContext.Provider value={dispatch}>
                <Nav store={store} />
              </appContext.Provider>
            ) : null}
          </Row>
          <Divider style={{marginTop: '0px'}} />
          {children}
        </Content>
        <Footer style={{textAlign: 'center', backgroundColor: 'transparent'}}>
          <Text>Built with love by</Text> <a href="https://facebook.com/rayriffy">r4yr1ffy</a>
        </Footer>
      </Layout>
    </>
  )
}

export default App

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  store: PropTypes.object,
}
