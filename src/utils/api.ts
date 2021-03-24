import store from '../store';
import {
  Config as ConfigType,
} from '../types/config';
import stdDialogs from '../data/standardDialogs';
import help from '../data/help';
import { divider } from '../data/constants';

export const loadAll = async () => {
  const started = new Date();
  // const version = 202012;
  const version = 202103;

  const json: ConfigType = await fetch(`./tunes/${version}.json`)
    .then((response) => response.json());

  const tune = await fetch(`./tunes/${version}.msq`)
    .then((response) => response.text());

  const xml = (new DOMParser()).parseFromString(tune, 'text/xml');
  const xmlPages = xml.getElementsByTagName('page');
  const constants: any = {};

  Object.keys(xmlPages).forEach((key: any) => {
    const page = xmlPages[key];
    const pageElements = page.children;

    Object.keys(pageElements).forEach((item: any) => {
      const element = pageElements[item];

      if (element.tagName === 'constant') {
        const attributes: any = {};

        Object.keys(element.attributes).forEach((attr: any) => {
          attributes[element.attributes[attr].name] = element.attributes[attr].value;
        });

        const val = element.textContent?.replace(/"/g, '').toString();

        constants[attributes.name] = {
          value: Number.isNaN(Number(val)) ? val : Number(val),
          // digits: Number.isNaN(Number(attributes.digits)) ? attributes.digits : Number(attributes.digits),
          // cols: Number.isNaN(Number(attributes.cols)) ? attributes.cols : Number(attributes.cols),
          // rows: Number.isNaN(Number(attributes.rows)) ? attributes.rows : Number(attributes.rows),
          units: attributes.units ?? null,
        };
      }
    });
  });

  if (!Object.keys(constants).length) {
    console.error('Invalid tune');
  }

  const config = json;

  // override / merge standard dialogs, constants and help
  config.dialogs = {
    ...config.dialogs,
    ...stdDialogs,
  };
  config.help = {
    ...config.help,
    ...help,
  };
  config.constants.pages[0].data.divider = divider;

  const loadingTimeInfo = `Tune loaded in ${(new Date().getTime() - started.getTime())}ms`;
  console.log(loadingTimeInfo);

  store.dispatch({ type: 'config/load', payload: config });
  store.dispatch({ type: 'tune/load', payload: { constants } });
  store.dispatch({
    type: 'status',
    payload: loadingTimeInfo,
  });
};

export const loadLogs = () => fetch('./logs/short.mlg').then((response) => response.arrayBuffer());
