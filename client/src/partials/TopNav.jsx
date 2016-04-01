import React from 'react';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';
import Icon from '../components/Icon';

const TopNav = ({openNav, title}) => (
	<nav className="top-nav">
		<section>
			<a onTouchTap={openNav} className="hidden-md-up sidebar-toggle">
				<Icon name="menu" />
			</a>
		</section>
		<div className="title">{title}</div>
		<section>&nbsp;</section>
	</nav>
);

export default connect(null, AppActions)(TopNav);