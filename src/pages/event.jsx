import _ from 'lodash'
import React, {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import InfiniteScroll from 'react-infinite-scroller'

import {Loading, appContext, Axios} from '../bridge'

import Strip from '../components/strip'

import {Row, Empty, Tabs} from 'antd'

const TabPane = Tabs.TabPane

const Event = props => {
  const {store} = props
  const eventID = props.match.params.id

  const [flights, setFlights] = useState([])
  const [more, setMore] = useState(true)
  const [error, setError] = useState(false)
  const [errorRaw, setErrorRaw] = useState(null)
  const [tabs] = useState([
    {
      name: 'Departure',
      key: 'dep',
    },
    {
      name: 'Arrival',
      key: 'arr',
    },
  ])

  const dispatch = useContext(appContext)

  const loadMoreFlights = async page => {
    try {
      const out = await Axios.get(`${store.apiEndpoint}/api/v1/flight/list/${eventID}/${page}`)

      if (out.data.response.data.flights.length === 0) {
        setMore(false)
        return
      }

      setFlights(prev => [...prev, ...out.data.response.data.flights])
    } catch (err) {
      setMore(false)
      setErrorRaw(err.response.data)
      setError(true)
    }
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
      {error === true ? (
        errorRaw.code === 706 ? (
          <Empty description={`This event is closed for reservation`} />
        ) : (
          <>Could not fetch flights</>
        )
      ) : (
        <appContext.Provider value={dispatch} key={`${eventID}-list-context`}>
          <Tabs defaultActiveKey="0">
            {tabs.map((tab, i) => (
              <TabPane tab={tab.name} key={i}>
                <Row gutter={16} type="flex" justify="space-around" align="middle" key="grid-row">
                  {_.filter(flights, o => o.type === tab.key).map(flight => (
                    <Strip key={`${eventID}-strip-${flight.id}`} eventID={eventID} flightID={flight.id} store={store} />
                  ))}
                </Row>
              </TabPane>
            ))}
          </Tabs>
          {!more ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`Reached the end`} /> : null}
        </appContext.Provider>
      )}
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
