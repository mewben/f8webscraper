import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import SideNav from '../partials/SideNav';
import Cover from '../partials/Cover';
import Notification from '../components/Notification';

const Admin = ({app, children}) => {
	const cl = cn(app.flags.toJS());

	return (
		<div className={cl}>
			<SideNav profile={app.me} />
			<main>{children}</main>
			<Cover />
			<Notification notif={app.notif} />
		</div>
	);
};

function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps)(Admin);