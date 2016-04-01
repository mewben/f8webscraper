import React from 'react';

import TopNav from '../partials/TopNav';
import ListPurchases from '../components/ListPurchases';

const PurchaseHistory = () => (
	<div className="main-content">
		<TopNav title="My Purchase History" />
		<div className="content">
			<ListPurchases />
		</div>
	</div>
);

export default PurchaseHistory;