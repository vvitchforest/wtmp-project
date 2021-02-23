//const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

import {networkProxyUrl} from "../settings";

/**
 *
 * @param {String} url API endpoint
 * @param {Boolean} useProxy use proxy in fetch or not
 * @returns {Object} json data
 */

const fetchGet = async (url, useProxy = false) => {
  let response;
  try {
    response = await fetch(`${useProxy ? networkProxyUrl : ''}${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`network fetchGet error`, error.message);
  }
  const responseData = await response.json();
  return responseData;
};

//Export functions separately in export object
export {fetchGet};
