import React from 'react'

import {Row, Col, Card, Typography} from 'antd'

const {Title} = Typography

const Error = props => {
  return (
    <Row>
      <Col xs={{span: 20, offset: 2}} sm={{span: 16, offset: 4}} md={{span: 12, offset: 6}} lg={{span: 8, offset: 8}}>
        <Card>
          <Title level={2}>Not found</Title>
          <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Card>
      </Col>
    </Row>
  )
}

export default Error
