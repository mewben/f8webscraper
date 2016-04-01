import React from 'react';

import TopNav from '../partials/TopNav';
import ListEncashments from '../components/ListEncashments';

const Encashments = () => (
	<div className="main-content">
		<TopNav title="Encashments" />
		<div className="content">
			<ListEncashments />
		</div>
	</div>
);

export default Encashments;