import _ from 'lodash'
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Axios, Link} from '../bridge'
import {mockupFlight} from '../assets/flights'

import {Row, Col, Card, Typography, Icon, Button, Skeleton, Modal, Input, Select} from 'antd'

const {Title, Text} = Typography

const {Option} = Select

const Strip = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [raw, setRaw] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const eventID = props.eventID
  const flightID = props.flightID

  useEffect(() => {
    if (raw === null) {
      // TODO: Get flight from API and set into raw
      try {
        setRaw(_.sample(mockupFlight))
        setRaw(prev => {
          return {...prev, booked: Math.random() >= 0.5}
        })
        setError(false)
        setIsLoading(false)
      } catch (err) {
        console.log(err)
        setError(true)
        setIsLoading(false)
      }
    }
  }, [props, raw])

  const bookflight = data => {
    setIsBooking(true)

    // TODO: Book flight by using API
    console.log('Book')
  }

  return (
    <Col xs={{span: 24}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} style={{margin: '5px 0'}}>
      <Card loading={isLoading}>
        {error ? (
          <Title>Could not fetch data</Title>
        ) : isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-title`}>
              <Title level={3} style={{marginBottom: 0}}>
                {raw.flight}
              </Title>
              <Text type="secondary">{flightID}</Text>
            </Row>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-meta`}>
              <Row key={`${flightID}-meta-airport`}>
                <Col span={8}>
                  <Text strong>Airport</Text>
                </Col>
                <Col span={16}>
                  <Text>
                    {raw.airport.departure} <Icon type="right" /> {raw.airport.arrival}
                  </Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-aircraft`}>
                <Col span={8}>
                  <Text strong>Aircraft</Text>
                </Col>
                <Col span={16}>
                  <Text>{raw.aircraft}</Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-departure`}>
                <Col span={8}>
                  <Text strong>Departure</Text>
                </Col>
                <Col span={16}>
                  <Text>{raw.time.departure}</Text>
                </Col>
              </Row>
            </Row>
            <Row key={`${flightID}-action`}>
              <Button block onClick={() => setShowModal(true)} disabled={raw.booked}>
                {raw.booked ? 'Booked' : 'Book'}
              </Button>
            </Row>

            <Modal
              title={`Booking flight ${raw.flight}`}
              visible={showModal}
              confirmLoading={isBooking}
              onOk={() => bookflight()}
              onCancel={() => setShowModal(false)}>
              <Row>
                <Col span={24}>You are going to book the following flight</Col>
              </Row>
              <Row style={{margin: '10px 0'}}>
                <Card span={24}>
                  <Title level={4}>{raw.flight}</Title>
                  {raw.airport.departure} <Icon type="right" /> {raw.airport.arrival}
                </Card>
              </Row>
              <Row>
                <Col span={24}>Click OK to proceed</Col>
              </Row>
            </Modal>
          </>
        )}
      </Card>
    </Col>
  )
}

export default Strip

Strip.propTypes = {
  eventID: PropTypes.string,
  flightID: PropTypes.string,
}
