import React, {useContext} from 'react'
import PropTypes from 'prop-types'

import {appContext, Link} from '../bridge'

import {Col, Icon, Drawer, Typography, List} from 'antd'

const {Title, Text} = Typography

const Nav = props => {
  const dispatch = useContext(appContext)

  const {store} = props

  const menuStack = [
    {
      name: 'Home',
      url: '/',
    },
  ]

  const toggleMenu = () => {
    dispatch({
      type: 'toggleMenu',
      toggleMenu: !store.toggleMenu,
    })
  }

  return (
    <Col span={2}>
      <Icon style={{fontSize: '24px', paddingBottom: 0, marginBottom: '5px'}} type="more" onClick={() => toggleMenu()} />
      <Drawer
        title={
          <Title level={2} style={{marginBottom: 0}}>
            Menu
          </Title>
        }
        placement="left"
        closable={false}
        onClose={() => toggleMenu()}
        visible={store.toggleMenu}>
        <List
          dataSource={menuStack}
          renderItem={item => (
            <List.Item>
              <Link to={item.url}>
                <Text>{item.name}</Text>
              </Link>
            </List.Item>
          )}
        />
      </Drawer>
    </Col>
  )
}

export default Nav

Nav.propTypes = {
  store: PropTypes.object,
}
