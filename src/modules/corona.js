import { fetchGet } from './network';
import { coronaProxyUrl } from '../settings';
const coronaUrl = `/pivot/prod/fi/epirapo/covid19case/fact_epirapo_covid19case.json?row=hcdmunicipality2020-445193.&column=dateweek20200101-509030&filter=measure-444833 `;

const getCoronaInfo = async () => {
  try {
    const data = await fetchGet(`${coronaProxyUrl}${coronaUrl}`);
    return parseCoronaData(data.dataset);
  } catch (error) {
    throw new Error(error.message);
  }
};

const parseCoronaData = (coronaData) => {
  let coronaObj = {
    title: coronaData.label,
    area: coronaData.dimension.hcdmunicipality2020.category.label[445193],
    casesThisWeek: "",
    casesTotal: ""
  };

  const casesArray = Object.values(coronaData.value);
  const totalCases = casesArray[ casesArray.length - 1 ];
  const thisWeek = casesArray[ casesArray.length - 2] ;

  coronaObj.casesThisWeek = thisWeek;
  coronaObj.casesTotal = totalCases;
  return coronaObj;
};

const CoronaData = { getCoronaInfo };
export default CoronaData;
