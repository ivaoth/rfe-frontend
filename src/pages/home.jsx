import React, {useEffect, useState, useContext} from 'react'
import PropTypes from 'prop-types'

import {Axios, Loading, Link, appContext} from '../bridge'

import EventCard from '../components/eventcard'

import {Row, Col, Typography, Empty} from 'antd'

const {Title, Text} = Typography

const Home = props => {
  const [raw, setRaw] = useState([])
  const [error, setError] = useState(false)
  const [asyncInProgress, setAsyncInProgress] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {store} = props

  const dispatch = useContext(appContext)

  useEffect(() => {
    ;(async () => {
      dispatch({type: 'setSubMenu', subMenu: 'events'})

      if (isLoading === true && error === false && asyncInProgress !== true) {
        setAsyncInProgress(true)
        try {
          console.log(`fetch`)
          const out = await Axios.get(`${store.apiEndpoint}/api/v1/event/list`)
          setRaw(out.data.response.data.events)
          setAsyncInProgress(false)
          setIsLoading(false)
        } catch {
          setError(true)
          setAsyncInProgress(false)
          setIsLoading(false)
        }
      }
    })()
  }, [asyncInProgress, dispatch, error, isLoading, store])

  return (
    <>
      <Row>
        <Col xs={{span: 22, offset: 1}}>
          <Title level={2}>Avaliable events</Title>
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Text>Could not fetch data</Text>
          ) : (
            <Row>
              {raw.length === 0 ? (
                <Empty description={`No available events`} />
              ) : (
                <>
                  {raw.map(event => (
                    <Col xs={{span: 24}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} key={`card-event-${event.id}`}>
                      <Link to={`/event/${event.id}`}>
                        <EventCard event={event} />
                      </Link>
                    </Col>
                  ))}
                </>
              )}
            </Row>
          )}
        </Col>
      </Row>
    </>
  )
}

export default Home

Home.propTypes = {
  store: PropTypes.object,
}
