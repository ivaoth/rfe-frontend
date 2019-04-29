import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import {Axios} from '../bridge'

import {Row, Col, Card, Typography, Icon, Button, Skeleton, Modal, message} from 'antd'

const {Title, Text} = Typography

const Strip = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [raw, setRaw] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const {store} = props

  const eventID = props.eventID
  const flightID = props.flightID

  const fetchFlight = useCallback(async () => {
    setIsLoading(true)
    try {
      const out = await Axios.get(`${store.apiEndpoint}/api/v1/flight/get/${eventID}/${flightID}`)

      setRaw(out.data.response.data.flight)

      setError(false)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      setError(true)
      setIsLoading(false)
    }
  }, [eventID, flightID, store.apiEndpoint])

  const bookflight = async token => {
    setIsBooking(true)

    try {
      message.loading('Reserving flight...')

      const payload = {
        event: {
          id: eventID,
        },
        flight: {
          id: flightID,
          reserver: {
            token: token,
          },
        },
      }

      await Axios.post(`${store.apiEndpoint}/api/v1/flight/reserve`, payload)

      message.success('Flight booked')
      fetchFlight()
      setShowModal(false)
      setIsBooking(false)
    } catch {
      message.error('Unable to reserve this flight')
      fetchFlight()
      setShowModal(false)
      setIsBooking(false)
    }
  }

  useEffect(() => {
    if (raw === null) {
      fetchFlight()
    }
  }, [fetchFlight, raw])

  return (
    <Col xs={{span: 24}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} style={{margin: '5px 0'}}>
      <Card loading={isLoading}>
        {error ? (
          <>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-title`}>
              <Title level={3} style={{marginBottom: 0}}>
                {raw.flight}
              </Title>
              <Text type="secondary">{flightID}</Text>
            </Row>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-meta`}>
              <Text>Could not fetch data</Text>
            </Row>
          </>
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
                  <Text>{raw.type}</Text>
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
              <Button block onClick={() => setShowModal(true)} disabled={raw.reserver === null}>
                {raw.reserver === null ? `Reserved by ${raw.reserver.vid}` : 'Reserve'}
              </Button>
            </Row>

            <Modal
              title={`Reserving flight ${raw.flight}`}
              visible={showModal}
              confirmLoading={isBooking}
              onOk={() => bookflight('IVAOTOKEN')}
              onCancel={() => setShowModal(false)}>
              <Row>
                <Col span={24}>You are going to reserve the following flight</Col>
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
  store: PropTypes.object,
  eventID: PropTypes.string,
  flightID: PropTypes.string,
}
