import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
import Main from '../../page/MainPage';
import Seeding from '../../page/SeedingPage';
import Upload from '../../page/UploadPage'
import Video from '../../page/VideoPage'


import { Provider } from "react-redux";
import store from "../../redux/store"

const browserHistory = history.createBrowserHistory();

export const renderRoutes = () => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/upload" component={Upload} />
        <Route exact path="/seeding" component={Seeding} />
        <Route exact path="/video" component={Video} />
      </Switch>
    </Router>
  </Provider>
);