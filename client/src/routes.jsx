import React from 'react';
import Route from 'react-router/lib/Route';

import App from './routes/App';
import Home from './routes/Home';
import Nerdy from './routes/Nerdy';

export default (
	<Route component={App}>
		<Route path="/" component={Home} />
		<Route path="/nerdy" component={Nerdy} />
	</Route>
);