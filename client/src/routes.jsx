import React from 'react';
import Route from 'react-router/lib/Route';
//import IndexRoute from 'react-router/lib/IndexRoute';

import App from './routes/App';
import Home from './routes/Home';
/*import Login from './routes/Login';
import Logout from './routes/Logout';
import Register from './routes/Register';
import Welcome from './routes/Welcome';

import Admin from './routes/Admin';
import Dashboard from './routes/Dashboard';
import Slots from './routes/Slots';
import Encashments from './routes/Encashments';
import Network from './routes/Network';
import PurchaseHistory from './routes/PurchaseHistory';
import Account from './routes/Account';

function requireAuth(nextState, replaceState) {
	if (!localStorage.getItem('jwt')) {
		replaceState(null, '/login');
	}
}

export default (
	<Route component={App}>
		<Route path="login" component={Login} />
		<Route path="logout" component={Logout} />
		<Route path="register" component={Register} />
		<Route path="welcome/:id" component={Welcome} />
		<Route path="/" component={Admin} onEnter={requireAuth}>
			<IndexRoute component={Dashboard} />
			<Route path="packages" component={Slots} />
			<Route path="encashments" component={Encashments} />
			<Route path="network" component={Network} />
			<Route path="purchase-history" component={PurchaseHistory} />
			<Route path="profile" component={Account} />
		</Route>
	</Route>
);*/

export default (
	<Route component={App}>
		<Route path="/" component={Home} />
	</Route>
);