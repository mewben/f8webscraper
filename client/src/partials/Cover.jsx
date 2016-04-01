import React from 'react';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';

const Cover = ({closeNav}) => (
	<div
		onTouchTap={closeNav}
		className="content-cover"
	></div>
);

export default connect(null, AppActions)(Cover);