import React from 'react';

import TopNav from '../partials/TopNav';
import FormAccount from '../components/FormAccount';

const Account = () => (
	<div className="main-content">
		<TopNav title="My Account" />
		<div className="content">
			<FormAccount />
		</div>
	</div>
);

export default Account;