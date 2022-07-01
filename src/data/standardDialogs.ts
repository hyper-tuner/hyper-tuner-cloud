import { Dialogs as DialogsType } from '@hyper-tuner/types';

const standardDialogs: DialogsType = {
  std_injection: {
    title: 'Engine Constants',
    help: 'https://wiki.speeduino.com/en/configuration/Engine_Constants',
    layout: '',
    panels: {
      engine_constants_southwest: {
        layout: '',
        fields: [], // overridden by ini file
        condition: '',
      },
    },
    fields: [
      {
        name: 'reqFuel',
        title: 'Required Fuel',
      },
      {
        name: 'algorithm',
        title: 'Control Algorithm',
      },
      {
        name: 'divider',
        title: 'Squirts Per Engine Cycle',
      },
      {
        name: 'alternate',
        title: 'Injector Staging',
      },
      {
        name: 'twoStroke',
        title: 'Engine Stroke',
      },
      {
        name: 'nCylinders',
        title: 'Number of Cylinders',
      },
      {
        name: 'injType',
        title: 'Injector Port Type',
      },
      {
        name: 'nInjectors',
        title: 'Number of Injectors',
      },
      {
        name: 'engineType',
        title: 'Engine Type',
      },
    ],
  },
};

export default standardDialogs;
