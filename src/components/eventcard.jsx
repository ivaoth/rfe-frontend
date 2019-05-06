import React from 'react'
import PropTypes from 'prop-types'

import {Link} from '../bridge'

import {Card, Divider, Button, Typography} from 'antd'

const {Text} = Typography

const EventCard = props => {
  const {event, link = false} = props

  return (
    <Card
      cover={
        link === true ? (
          <Link to={`/event/${event.id}`}>
            <img alt={event.name} src={event.cover} style={{width: '100%'}} />
          </Link>
        ) : (
          <img alt={event.name} src={event.cover} style={{width: '100%'}} />
        )
      }>
      <p style={{marginBottom: '8px', color: 'rgba(0,0,0,0.85)', fontSize: '16px', fontWeight: 500}}>{event.name}</p>
      <Text type="secondary">{event.desc}</Text>
      {event.breifing.pilot === null && event.breifing.atc === null ? null : (
        <>
          <Divider orientation="left">
            <Text style={{fontSize: '14px'}} strong>
              Breifing
            </Text>
          </Divider>
          {event.breifing.pilot === null ? null : (
            <a href={event.breifing.pilot} target="_blank" rel="noopener noreferrer">
              <Button type="dashed">Pilot</Button>
            </a>
          )}
          {event.breifing.atc === null ? null : (
            <a href={event.breifing.atc} target="_blank" rel="noopener noreferrer">
              <Button type="dashed">ATC</Button>
            </a>
          )}
        </>
      )}
    </Card>
  )
}

export default EventCard

EventCard.propTypes = {
  event: PropTypes.object,
  link: PropTypes.bool,
}
