import _ from 'lodash'
import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Axios, appContext, Loading} from '../bridge'

import {Row, Col, Typography, List, Modal, message, Card, Icon, Divider} from 'antd'

const {Title, Text} = Typography
const {Meta} = Card

const Wallet = props => {
  const [raw, setRaw] = useState(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [asyncInProgress, setAsyncInProgress] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalRaw, setModalRaw] = useState(null)

  const {store} = props

  const dispatch = useContext(appContext)

  useEffect(() => {
    ;(async () => {
      dispatch({type: 'setSubMenu', subMenu: 'wallet'})

      if (raw === null && asyncInProgress !== true) {
        setAsyncInProgress(true)

        try {
          const out = await Axios.get(`${store.apiEndpoint}/api/v1/flight/reserved/${store.identity.vid}`)

          setRaw(out.data.response.data.flights)
          setAsyncInProgress(false)
          setIsLoading(false)
        } catch {
          setError(true)
          setIsLoading(false)
        }
      }
    })()
  }, [asyncInProgress, dispatch, raw, store])

  const modalCancel = item => {
    Modal.confirm({
      title: 'Are you sure to do that?',
      content: (
        <>
          You are going to cancel flight <Text strong>{item.flight.flight}</Text> for event{' '}
          <Text strong>{item.event.name}</Text>
        </>
      ),
      async onOk() {
        await message.loading('Canceling flight...')
        try {
          const payload = {
            token: store.token,
            event: {
              id: item.event.id,
            },
            flight: {
              id: item.flight.id,
            },
          }

          await Axios.post(`${store.apiEndpoint}/api/v1/flight/cancel`, payload)

          setRaw(prev => _.filter(raw, o => o.event.id !== item.event.id && o.flight.id !== item.flight.id))

          message.success('Flight canceled')
        } catch (e) {
          console.log(e.response.data)
          message.error('Unable to cancel this flight')
        }
      },
    })
  }

  const modalInfo = async item => {
    setModalRaw(null)
    setShowModal(true)

    const route = await Axios.get(
      `${store.apiEndpoint}/api/v1/route/get/${item.flight.airport.departure}/${item.flight.airport.arrival}`,
    )

    setModalRaw({...item, route: route.data.response.data.route})
  }

  return (
    <Row>
      <Col xs={{span: 22, offset: 1}} sm={{span: 18, offset: 3}} md={{span: 14, offset: 5}} lg={{span: 10, offset: 7}}>
        <Title level={2}>Wallet</Title>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <Text>Could not fetch data</Text>
        ) : (
          <Row>
            <List
              itemLayout="horizontal"
              bordered
              style={{background: '#fff'}}
              dataSource={raw}
              renderItem={item => (
                <List.Item
                  actions={
                    item.event.isOpen
                      ? [
                          <Text
                            key={`${item.event.id}-${item.flight.id}-button-cancel`}
                            type="danger"
                            onClick={() => modalCancel(item)}>
                            cancel
                          </Text>,
                          <Text
                            style={{color: '#1890ff'}}
                            key={`${item.event.id}-${item.flight.id}-button-more`}
                            onClick={() => modalInfo(item)}>
                            more
                          </Text>,
                        ]
                      : [
                          <Text
                            style={{color: '#1890ff'}}
                            key={`${item.event.id}-${item.flight.id}-button-more`}
                            onClick={() => modalInfo(item)}>
                            more
                          </Text>,
                        ]
                  }>
                  <List.Item.Meta title={item.flight.flight} description={item.event.name} />
                </List.Item>
              )}
            />

            <Modal
              title={modalRaw === null ? `Loading` : `Flight information for ${modalRaw.flight.flight}`}
              visible={showModal}
              width={700}
              onCancel={() => setShowModal(false)}
              onOk={() => setShowModal(false)}>
              {modalRaw === null ? (
                <Loading />
              ) : (
                <>
                  <Row gutter={16}>
                    <Col xs={{span: 24}} md={{span: 10}}>
                      <Row>
                        <Title level={3}>Event</Title>
                      </Row>
                      <Row style={{margin: '10px 0'}}>
                        <Card cover={<img alt={modalRaw.event.name} src={modalRaw.event.cover} />}>
                          <Meta title={modalRaw.event.name} description={modalRaw.event.desc} />
                        </Card>
                      </Row>
                    </Col>
                    <Col xs={{span: 24}} md={{span: 14}}>
                      <Row>
                        <Title level={3}>Flight</Title>
                      </Row>
                      <Row style={{margin: '10px 0'}}>
                        <Card span={24}>
                          <Title level={4}>{modalRaw.flight.flight}</Title>
                          <Row>
                            <Col span={24}>
                              {modalRaw.flight.airport.departure}{' '}
                              {modalRaw.flight.bay !== null && modalRaw.flight.bay.departure !== null
                                ? `(${modalRaw.flight.bay.departure})`
                                : null}{' '}
                              <Icon type="right" /> {modalRaw.flight.airport.arrival}{' '}
                              {modalRaw.flight.bay !== null && modalRaw.flight.bay.arrival !== null
                                ? `(${modalRaw.flight.bay.arrival})`
                                : null}
                            </Col>
                          </Row>
                          <Divider />
                          <Row>
                            <Col span={24}>
                              <Text strong>Airline ICAO</Text> {modalRaw.flight.airline.code}
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Text strong>Aircraft</Text> {modalRaw.flight.type}
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Text strong>Departure time</Text> {modalRaw.flight.time.departure}
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Text strong>EST. arrival time</Text> {modalRaw.flight.time.arrival}
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Text strong>Distance</Text> {modalRaw.flight.distance} nm
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Text strong>Route</Text> {modalRaw.route.route}
                            </Col>
                          </Row>
                        </Card>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </Modal>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default Wallet

Wallet.propTypes = {
  store: PropTypes.object,
}
