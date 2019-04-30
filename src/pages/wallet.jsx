import _ from 'lodash'
import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Axios, appContext, Loading} from '../bridge'

import {Row, Col, Typography, List, Modal, message} from 'antd'

const {Title, Text} = Typography

const Wallet = props => {
  const [raw, setRaw] = useState(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [asyncInProgress, setAsyncInProgress] = useState(false)

  const {store} = props

  const dispatch = useContext(appContext)

  useEffect(() => {
    ;(async () => {
      dispatch({type: 'setSubMenu', subMenu: 'wallet'})

      if (raw === null && asyncInProgress !== true) {
        setAsyncInProgress(true)

        try {
          const out = await Axios.get(`${store.apiEndpoint}/api/v1/flight/reserved/${store.identity.vid}`)

          console.log(out.data)
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
                          <Text key={`${item.event.id}-${item.flight.id}-button-more`} disabled>
                            more
                          </Text>,
                        ]
                      : [
                          <Text key={`${item.event.id}-${item.flight.id}-button-more`} disabled>
                            more
                          </Text>,
                        ]
                  }>
                  <List.Item.Meta title={item.flight.flight} description={item.event.name} />
                </List.Item>
              )}
            />
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
