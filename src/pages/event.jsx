import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import InfiniteScroll from 'react-infinite-scroller'

import {Loading, appContext, Axios} from '../bridge'

import Strip from '../components/strip'

import {Row, Empty} from 'antd'

const Event = props => {
  const {store} = props
  const eventID = props.match.params.id

  const [flights, setFlights] = useState([])
  const [more, setMore] = useState(true)

  const dispatch = useContext(appContext)

  const loadMoreFlights = async page => {
    const out = await Axios.get(`${store.apiEndpoint}/api/v1/flight/list/${eventID}/${page}`)

    if (out.data.response.data.flights.length === 0) {
      setMore(false)
      return
    }

    setFlights(prev => [...prev, ...out.data.response.data.flights])
  }

  useEffect(() => {
    dispatch({type: 'setSubMenu', subMenu: 'listing'})
  }, [dispatch])

  return (
    <InfiniteScroll
      key={`${eventID}-list-scroller`}
      pageStart={0}
      loadMore={loadMoreFlights}
      hasMore={more}
      loader={<Loading key={`${eventID}-list-loader`} />}>
      <appContext.Provider value={dispatch} key={`${eventID}-list-context`}>
        <Row gutter={16} type="flex" justify="space-around" align="middle" key="grid-row">
          {flights.map(flight => (
            <Strip key={`${eventID}-strip-${flight}`} eventID={eventID} flightID={flight} store={store} />
          ))}
        </Row>
        {!more ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Reached the end`} /> : null}
      </appContext.Provider>
    </InfiniteScroll>
  )
}

export default withRouter(Event)

Event.propTypes = {
  store: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
}
