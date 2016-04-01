import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';

class Logout extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	static propTypes = {
		logout: PropTypes.func
	};

	componentWillMount() {
		this.props.logout();
		this.context.router.replace('/login');
	}

	render() {
		return null;
	}

}

export default connect(null, AppActions)(Logout);