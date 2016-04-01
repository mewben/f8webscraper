import React from 'react';

import TopNav from '../partials/TopNav';
import ListSlots from '../components/ListSlots';

const Slots = () => (
	<div className="main-content">
		<TopNav title="Packages" />
		<div className="content">
			<ListSlots />
		</div>
	</div>
);

export default Slots;