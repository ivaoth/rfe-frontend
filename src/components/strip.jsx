import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import {Axios, Loading} from '../bridge'

import {Row, Col, Card, Typography, Icon, Button, Modal, message, Divider} from 'antd'

const {Title, Text} = Typography

const Strip = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [raw, setRaw] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  const {store} = props

  const eventID = props.eventID
  const flightID = props.flightID

  const fetchFlight = useCallback(async () => {
    setIsLoading(true)
    setIsModalLoading(true)
    setRaw(null)
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

  const toggleModal = async () => {
    setShowModal(true)
    setIsModalLoading(true)
    const out = await Axios.get(`${store.apiEndpoint}/api/v1/route/get/${raw.airport.departure}/${raw.airport.arrival}`)

    setRaw(prev => ({...prev, route: out.data.response.data.route}))
    setIsModalLoading(false)
  }

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

      message.success('Flight booked and added to your wallet')
      fetchFlight()
      setShowModal(false)
      setIsBooking(false)
    } catch (err) {
      if (err.response.data.code === 701) {
        message.warning('You already reserved flight for this event')
      } else {
        message.error('Unable to reserve this flight')
      }

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
          <Loading />
        ) : (
          <>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-title`}>
              <Title level={3} style={{marginBottom: 0}}>
                {raw.flight}
              </Title>
              <Text type="secondary">{raw.airline.name}</Text>
            </Row>
            <Row style={{marginBottom: '10px'}} key={`${flightID}-meta`}>
              <Row key={`${flightID}-meta-airport`}>
                <Col span={11}>
                  <Text strong>Airport</Text>
                </Col>
                <Col span={13}>
                  <Text>
                    {raw.airport.departure} <Icon type="right" /> {raw.airport.arrival}
                  </Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-aircraft`}>
                <Col span={11}>
                  <Text strong>Aircraft</Text>
                </Col>
                <Col span={13}>
                  <Text>{raw.type}</Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-departure`}>
                <Col span={11}>
                  <Text strong>Departure</Text>
                </Col>
                <Col span={13}>
                  <Text>{raw.time.departure}</Text>
                </Col>
              </Row>
              <Row key={`${flightID}-meta-flight-time`}>
                <Col span={11}>
                  <Text strong>EST. flight time</Text>
                </Col>
                <Col span={13}>
                  <Text>{raw.time.total}</Text>
                </Col>
              </Row>
            </Row>
            <Row key={`${flightID}-action`}>
              <Button block onClick={() => toggleModal()} disabled={raw.reserver !== null}>
                {raw.reserver !== null ? `Reserved by ${raw.reserver.vid}` : 'Reserve'}
              </Button>
            </Row>

            <Modal
              centered
              title={`Reserving flight ${raw.flight}`}
              visible={showModal}
              confirmLoading={isBooking}
              onOk={() => bookflight(store.token)}
              onCancel={() => setShowModal(false)}>
              {isModalLoading ? (
                <Loading />
              ) : (
                <>
                  <Row>
                    <Col span={24}>You are going to reserve the following flight.</Col>
                  </Row>
                  <Row style={{margin: '10px 0'}}>
                    <Card span={24}>
                      <Title level={4}>{raw.flight}</Title>
                      <Row>
                        <Col span={24}>
                          {raw.airport.departure} (NaN) <Icon type="right" /> {raw.airport.arrival} (NaN)
                        </Col>
                      </Row>
                      <Divider />
                      <Row>
                        <Col span={24}>
                          <Text strong>Airline ICAO</Text> {raw.airline.code}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Text strong>Aircraft</Text> {raw.type}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Text strong>Departure time</Text> {raw.time.departure}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Text strong>EST. arrival time</Text> {raw.time.arrival}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Text strong>Distance</Text> {raw.distance} nm
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Text strong>Route</Text> {raw.route.route}
                        </Col>
                      </Row>
                    </Card>
                  </Row>
                  <Row>
                    <Col span={24}>Click OK to proceed</Col>
                  </Row>
                </>
              )}
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
