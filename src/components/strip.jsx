import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import {Axios, Loading} from '../bridge'

import FlightCard from '../components/flightcard'

import {Row, Col, Card, Typography, Icon, Button, Modal, message, Checkbox, Tooltip} from 'antd'

const {Title, Text} = Typography

const Strip = props => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [raw, setRaw] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  const [returnCheck, setReturnCheck] = useState(false)
  const [returnRaw, setReturnRaw] = useState({flight: null, route: null})

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

  const toggleReturn = async () => {
    const newReturnState = !returnCheck
    setReturnCheck(newReturnState)

    if (returnRaw.flight === null && returnRaw.route === null && newReturnState === true) {
      try {
        Axios.get(`${store.apiEndpoint}/api/v1/flight/get/${eventID}/${raw.related.id}`).then(out => {
          const flight = out.data.response.data.flight

          Axios.get(`${store.apiEndpoint}/api/v1/route/get/${flight.airport.departure}/${flight.airport.arrival}`).then(
            out => {
              setReturnRaw(prev => ({...prev, flight: flight, route: out.data.response.data.route}))
            },
          )
        })
      } catch {
        message.error('Unable to fetch return flight')
      }
    }
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
        withRelated: returnCheck,
      }

      const out = await Axios.post(`${store.apiEndpoint}/api/v1/flight/reserve`, payload)

      message.success('Flight reserved')

      if (out.data.code === 202) {
        message.warning('Someone already reserved return flight')
      }

      message.info('New flight added to your wallet')
      fetchFlight()
      setShowModal(false)
      setIsBooking(false)
    } catch (err) {
      if (err.response.data.code === 701) {
        message.warning('You already reserved flight for this event')
      } else if (err.response.data.code === 706) {
        message.error('Someone already reserved this flight')
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
                {raw.flight}{' '}
                {raw.related.id === null ? null : (
                  <Tooltip title="Returning flight is available">
                    <Icon type="swap" />
                  </Tooltip>
                )}
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
                  <Text>{raw.aircraft}</Text>
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
              okText={`Reserve`}
              onCancel={() => setShowModal(false)}>
              {isModalLoading ? (
                <Loading />
              ) : (
                <>
                  <Row>
                    <Col span={24}>You are going to reserve the following flight.</Col>
                  </Row>
                  <Row style={{margin: '10px 0'}}>
                    <FlightCard flight={raw} route={raw.route} />
                  </Row>
                  {raw.related.id === null ? null : (
                    <>
                      <Row>
                        <Text>Returning flight is available!</Text>
                      </Row>
                      <Row>
                        <Checkbox checked={returnCheck} onChange={() => toggleReturn()}>
                          I also want to reserve returning flight
                        </Checkbox>
                      </Row>
                      {returnCheck ? (
                        <Row style={{margin: '10px 0'}}>
                          {returnRaw.flight === null && returnRaw.route === null ? (
                            <Card span={24}>
                              <Loading />
                            </Card>
                          ) : (
                            <FlightCard flight={returnRaw.flight} route={returnRaw.route} />
                          )}
                        </Row>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </Modal>
          </>
        )}
      </Card>
    </Col>
  )
}

const willUpdate = (prevProps, nextProps) => {
  return nextProps.eventID !== prevProps.eventID || nextProps.flightID !== prevProps.flightID
}

export default React.memo(Strip, willUpdate)

Strip.propTypes = {
  store: PropTypes.object,
  eventID: PropTypes.string,
  flightID: PropTypes.string,
}
