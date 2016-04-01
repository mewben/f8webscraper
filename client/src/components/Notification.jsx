import React, { Component, PropTypes } from 'react';
import Notify from 'react-notification-system';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';

class Notification extends Component {

	static propTypes = {
		hideNotification: PropTypes.func
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.notif.get('show')) {
			this.refs.notify.addNotification(nextProps.notif.toJS());

			setTimeout(() => {
				this.props.hideNotification();
			}, 100);
		}
	}

	render() {
		return <Notify ref="notify" style={false} noAnimation={false} />;
	}
}

export default connect(null, AppActions)(Notification);
