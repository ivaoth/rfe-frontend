import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Axios, Link} from '../bridge'

import {Row, Col, Card, Typography, Icon, Button, Skeleton, Modal} from 'antd'

const {Title, Text} = Typography

const Strip = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [raw, setRaw] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const eventID = props.eventID
  const flightID = props.flightID

  useEffect(() => {
    if (raw === null) {
      // TODO: Get flight from API and set into raw
      try {
        setRaw({
          callsign: 'THA123',
          aircraft: 'A359',
          airport: {
            arrival: 'VTSP',
            departure: 'VTBS',
          },
          departure: '12:00z',
          arrival: '13:00z',
          booked: Math.random() >= 0.5,
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
    // TODO: Book flight by using API
    console.log('Book')
    setShowModal(false)
  }

  return (
    <Col xs={{span: 6}} style={{margin: '5px 0'}}>
      <Card loading={isLoading}>
        {error ? (
          <Title>Could not fetch data</Title>
        ) : isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-title`}>
              <Title level={3} style={{marginBottom: 0}}>
                {raw.callsign}
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
                  <Text>{raw.departure}</Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-arrival`}>
                <Col span={8}>
                  <Text strong>Arrival</Text>
                </Col>
                <Col span={16}>
                  <Text>{raw.arrival}</Text>
                </Col>
              </Row>
            </Row>
            <Row key={`${flightID}-action`}>
              <Button block onClick={() => setShowModal(true)} disabled={raw.booked}>
                {raw.booked ? 'Booked' : 'Book'}
              </Button>
            </Row>

            <Modal
              title={`Booking flight ${raw.callsign}`}
              visible={showModal}
              onOk={() => bookflight()}
              onCancel={() => setShowModal(false)}>
              <p>ID: {flightID}</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
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
