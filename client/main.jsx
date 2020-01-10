import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import ons from 'onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { renderRoutes } from '../imports/startup/client/routes';

// var script = document.createElement('script');
// script.setAttribute('type', 'text/javascript');  // optional
// script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/webtorrent/0.107.17/webtorrent.min.js');
// document.getElementsByTagName('head')[0].appendChild(script);

Meteor.startup(() => {
  ons.ready(() => {
    render(renderRoutes(), document.getElementById('react-target'));
    // render(<App />, document.getElementById('react-target'));
  });
});
