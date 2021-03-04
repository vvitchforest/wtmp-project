import { fetchPostJson } from "./network";
const moment = require('moment');
const momentRange = require('moment-range');
momentRange.extendMoment(moment);

const apiUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

/*const getDeparturesAndArrivalsByStopId = async (id) => {
  const query = `{
    stop(id: "HSL:${id}") {
      name
      stoptimesWithoutPatterns {
        scheduledArrival
        realtimeArrival
        arrivalDelay
        scheduledDeparture
        realtimeDeparture
        departureDelay
        realtime
        realtimeState
        serviceDay
        headsign
        trip {
          routeShortName
          tripHeadsign
        }
      }
    };
  }`; */

const getDeparturesAndArrivalsByLocation = async (lat, lon) => {
  const query = `{
  stopsByRadius(lat: ${lat}, lon: ${lon}, radius: 600, first: 10) {
    edges {
      node {
        stop {
          gtfsId
          name
          code
          lat
          lon
          stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
            trip {
              tripHeadsign
              routeShortName
            }
          }
        }
        distance
      }
      cursor
    }
    pageInfo {
        hasNextPage
        endCursor
    }
  }
}`;

  try {
    const hslData = await fetchPostJson(apiUrl, 'application/graphql', query);
    return parseHSLData(hslData.data.stopsByRadius.edges);
  } catch (error) {
    console.error(error);
  }
};

const parseHSLData = (edges) => {
  const departuresToDisplay = 15;
  let departures = [];
    for(const edge of edges) {
      const stopTimesArray = edge.node.stop.stoptimesWithoutPatterns;

      for(const stopTime of stopTimesArray) {
        const departureObj = {
          distance: edge.node.distance,
          name: edge.node.stop.name,
          code: edge.node.stop.code,
          headsign: stopTime.headsign,
          routeShortName: stopTime.trip.routeShortName,
          realtimeArrival: stopTime.realtimeArrival,
          serviceDay: stopTime.serviceDay
        };
        departures.push(departureObj);
      }
    }
    departures.sort((a, b) => (a.realtimeArrival + a.serviceDay) - (b.realtimeArrival + b.serviceDay));
    return departures.slice(0, departuresToDisplay);
};

/**
 * Converts HSL time to more readable format
 *
 * @param {number} seconds - since midnight
 * @returns {string} HH:MM
 */
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) - (hours * 60);
  return `${hours >= 24 ? (hours - 24) : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

const checkTimeWindow = (departureUnix) => {
  const currentTime = moment.unix(moment.now() / 1000).format('YYYY-MM-DD h:mm a');
  const hoursFromNow = moment.unix(moment.now() / 1000 + (6 * 60 * 60)).format('YYYY-MM-DD h:mm a');
  const departure = moment.unix(departureUnix).format('YYYY-MM-DD h:mm a');

  const startMoment = moment(currentTime, 'YYYY-MM-DD h:mm a');
  const hoursFromNowMoment = moment(hoursFromNow, 'YYYY-MM-DD h:mm a');
  const departureMoment = moment(departure, 'YYYY-MM-DD h:mm a');

  const range = moment.range(startMoment, hoursFromNowMoment);
  return departureMoment.within(range);
};

const HSLData = { formatTime, getDeparturesAndArrivalsByLocation };
export default HSLData;
