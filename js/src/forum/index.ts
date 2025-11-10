import Application from 'flarum/common/Application';
import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';

import MobileTab from './components/MobileTab';

app.initializers.add('acpl/mobile-tab', () => {
  //@ts-ignore - missing 'mount' types
  extend(Application.prototype, 'mount', () => {
    const mTab = document.createElement('div');
    m.mount(document.body.appendChild(mTab), MobileTab);
  });
});

export * from './components';
