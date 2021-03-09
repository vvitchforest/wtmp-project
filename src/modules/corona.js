import { fetchGet } from './network';
import { coronaProxyUrl } from '../settings';
const coronaUrl = `/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json?row=hcdmunicipality2020-445193.&column=dateweek20200101-509030&filter=measure-444833 `;

const getCoronaInfo = async () => {
  try {
    const data = await fetchGet(`${coronaProxyUrl}${coronaUrl}`);
    console.log(data);
    return data.dataset;
  } catch (error) {
    throw new Error(error.message);
  }
};

const parseCoronaData = (coronaData) => {

  let coronaObj = {
    title: coronaData.label,
    name: coronaData,
  };

  console.log(coronaObj);
};

const CoronaData = { getCoronaInfo };
export default CoronaData;
