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

const getDeparturesAndArrivalsByLocation = async (lat, lon, distance) => {
  const query = `{
      nearest(lat: ${lat}, lon: ${lon}, maxDistance: ${distance}, filterByPlaceTypes: DEPARTURE_ROW) {
        edges {
          node {
            place {
              ...on DepartureRow {
                stop {
                  lat
                  lon
                  name
                  code
                }
                stoptimes {
                  serviceDay
                  scheduledDeparture
                  realtimeDeparture
                  trip {
                    route {
                      shortName
                      longName
                    }
                  }
                  headsign
                }
              }
            }
            distance
          }
        }
      }
    }`;

  // TODO: add try-catch error handling
  try {
    const hslData = await fetchPostJson(apiUrl, 'application/graphql', query);
    const departures = hslData.data.nearest.edges;

    const sortedDepartures = departures.filter((departure) => Object.values(departure.node.place.stoptimes).length > 0);
    const departuresWithinXHours = sortedDepartures.filter((departure) => checkTimeWindow(departure.node.place.stoptimes[0].serviceDay + departure.node.place.stoptimes[0].scheduledDeparture));
    departuresWithinXHours.sort((a, b) => a.node.place.stoptimes[0].scheduledDeparture - b.node.place.stoptimes[0].scheduledDeparture);

    return departuresWithinXHours;

  } catch (error) {
    console.error(error);
  }
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
