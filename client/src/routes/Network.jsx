import React from 'react';

import TopNav from '../partials/TopNav';
import ListNetwork from '../components/ListNetwork';

const Network = () => (
	<div className="main-content">
		<TopNav title="My Network" />
		<div className="content">
			<ListNetwork />
		</div>
	</div>
);

export default Network;