/**
 * Global app settings TEMPLATE
 *
 * USAGE: Add your setting values & rename to settings.js
 *
 */

// Generic proxy server only for random testing
// public cors-anywhere accepts only 50 request per hour
const networkProxyUrl = 'https://cors-anywhere.herokuapp.com/';

// Url for proxy-server/fazer.php (use your own)
const fazerProxyUrl = 'https://users.metropolia.fi/~irinakon/fazer.php';

const coronaProxyUrl = 'https://users.metropolia.fi/~irinakon/corona.php';

export {networkProxyUrl, fazerProxyUrl, coronaProxyUrl};
