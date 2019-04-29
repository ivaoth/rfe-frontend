import React, {useEffect, useState, useContext} from 'react'
import PropTypes from 'prop-types'

import {Axios, Loading, Link, appContext} from '../bridge'

import {Row, Col, Card, Typography} from 'antd'

const {Title, Text} = Typography
const {Meta} = Card

const Home = props => {
  const [raw, setRaw] = useState([])
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {store} = props

  const dispatch = useContext(appContext)

  useEffect(() => {
    ;(async () => {
      dispatch({type: 'setSubMenu', subMenu: 'events'})

      try {
        const out = await Axios.get(`${store.apiEndpoint}/api/v1/event/list`)
        setRaw(out.data.response.data.events)
        setIsLoading(false)
      } catch {
        setError(true)
        setIsLoading(false)
      }
    })()
  }, [dispatch, store.apiEndpoint])

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
              {raw.map(event => (
                <Col xs={{span: 24}} sm={{span: 12}} md={{span: 8}} lg={{span: 6}} key={`card-event-${event.id}`}>
                  <Link to={`/event/${event.id}`}>
                    <Card cover={<img alt={event.name} src={event.cover} />}>
                      <Meta title={event.name} description={event.desc} />
                    </Card>
                  </Link>
                </Col>
              ))}
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
