import React, {useEffect, useState} from 'react'

import {Axios, Loading, Link} from '../bridge'

import {Row, Col, Card, Typography} from 'antd'

const {Title, Text} = Typography
const {Meta} = Card

const Home = props => {
  const [raw, setRaw] = useState([])
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch avaliable events and put into raw
    try {
      setRaw([
        {
          id: 'someid',
          name: '1st Bangkok RFE',
          desc: 'Description such wow',
          cover: 'https://storage.th.ivao.aero/EVENTS/IVAO_BKK-RFE-2019.jpg',
        },
      ])
      setIsLoading(false)
    } catch {
      setError(true)
      setIsLoading(false)
    }
  }, [])

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
