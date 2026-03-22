import app from 'flarum/forum/app';
import MobileTab from './components/MobileTab';

export { default as extend } from './extend';

app.initializers.add('acpl/mobile-tab', () => {
  app.beforeMount(() => {
    m.mount(document.body.appendChild(document.createElement('div')), MobileTab);
  });
});
