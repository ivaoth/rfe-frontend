import React from 'react'
import PropTypes from 'prop-types'

import {Card, Typography, Row, Col, Icon, Divider} from 'antd'

const {Title, Text} = Typography

const FlightCard = props => {
  const {flight, route} = props

  return (
    <Card span={24}>
      <Row style={{marginBottom: '10px'}}>
        <Title level={4} style={{marginBottom: 0}}>
          {flight.flight}
        </Title>
        <Text type="secondary">{flight.id}</Text>
      </Row>
      <Row>
        <Col span={24}>
          {flight.airport.departure}{' '}
          {flight.bay !== null && flight.bay.departure !== null ? `(${flight.bay.departure})` : null} <Icon type="right" />{' '}
          {flight.airport.arrival} {flight.bay !== null && flight.bay.arrival !== null ? `(${flight.bay.arrival})` : null}
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Text strong>Airline ICAO</Text> {flight.airline.code}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text strong>Aircraft</Text> {flight.aircraft}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text strong>Departure time</Text> {flight.time.departure}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text strong>EST. arrival time</Text> {flight.time.arrival}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text strong>Distance</Text> {flight.distance} nm
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text strong>Route</Text> {route.route}
        </Col>
      </Row>
    </Card>
  )
}

export default FlightCard

FlightCard.propTypes = {
  id: PropTypes.number,
  flight: PropTypes.object,
  route: PropTypes.object,
}
