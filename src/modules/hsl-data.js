import { fetchPostJson } from "./network";

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
  return await fetchPostJson(apiUrl, 'application/graphql', query);
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
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

const HSLData = { formatTime, getDeparturesAndArrivalsByLocation};
export default HSLData;
