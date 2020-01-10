import React from 'react';
import { Router, Route, Switch } from 'react-router';
import history from 'history';

// route components
import AppContainer from '../../ui/App';
import Seeding from '../../page/SeedingPage';
import Upload from '../../page/UploadPage'
import Video from '../../page/VideoPage'

const browserHistory = history.createBrowserHistory();

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={AppContainer}/>
      <Route exact path="/upload" component={Upload}/>
      <Route exact path="/seeding" component={Seeding}/>
      <Route exact path="/video" component={Video}/>
    </Switch>
  </Router>
);