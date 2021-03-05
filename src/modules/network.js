//const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

import {networkProxyUrl} from "../settings";

/**
 *Creates HTTP Get request
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

/**
 * Creates HTTP Post request
 * @param {string} url API endpoint
 * @param {string} contentType
 * @param {Object} body request payload
 * @param {boolean} useProxy use proxy server or not
 * @returns {Object} json data
 */
const fetchPostJson = async (url, contentType, body, useProxy = false) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': contentType
    },
    body: body,
  };
  let response;
  try {
    response = await fetch(`${useProxy ? networkProxyUrl : ''}${url}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('network fetchPost error', error.message);
  }
  const responseJson = await response.json();
  return responseJson;
};

export {fetchGet, fetchPostJson};
