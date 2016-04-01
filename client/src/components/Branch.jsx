import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import moment from 'moment-timezone';
import cn from 'classnames';

import Icon from './Icon';
import Tree from './Tree';

import * as AppActions from '../actions/AppActions';

class Branch extends Component {

	static propTypes = {
		id: PropTypes.number,
		level: PropTypes.number,
		name: PropTypes.string,
		activated_at: PropTypes.any,
		dr: PropTypes.number,
		fetchNetwork: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			downline: new List(),
			loading: false,
			open: false
		};
	}

	_handleClick = () => {
		let { dr } = this.props;
		let { open } = this.state;

		if (!dr) {
			return;
		}

		if (open) {
			this.setState({
				open: false
			});
			return;
		}

		this.setState({
			loading: true
		});

		this.props.fetchNetwork(this.props.id).payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						downline: fromJS(res.payload || []),
						loading: false,
						open: true
					});
				} else {
					this.setState({
						loading: false
					});
				}
			});

	};

	_renderIcon() {
		let { loading } = this.state;
		let { dr } = this.props;

		if (loading) {
			return (
				<div className="inline">
					<div className="uil-ripple-css" style={{transform:"scale(0.1)"}}>
						<div></div>
						<div></div>
					</div>
				</div>
			);
		}

		if (!dr) {
			return (
				<Icon name="online" size="8" style={{marginTop: '3px', marginLeft: '5px'}} />
			);
		}

		return (
			<Icon name="right" size="20" />
		);
	}

	_renderTree() {
		let { downline, open } = this.state;

		if (!open) {
			return null;
		} else {
			return (
				<Tree
					branches={downline}
					level={this.props.level + 1}
				/>
			);
		}
	}

	render() {
		let { id, level, name, activated_at, dr } = this.props;
		let { open } = this.state;

		let leafcl = cn('leaf', {'has_dr': !!dr});
		let branchcl = cn('branch', {'open': open});

		return (
			<li className={branchcl}>
				<div className={leafcl} onClick={this._handleClick}>
					{this._renderIcon()}
					<div className="pull-xs-right text-muted">
						<small>Level {level}</small>
					</div>
					<span>
						<strong>{name}</strong><br />
						<small><span className="text-success">{id}</span> - {moment(activated_at).tz('Asia/Manila').format('lll')}</small>
					</span>
				</div>
				{this._renderTree()}
			</li>
		);
	}
}

export default connect(null, AppActions)(Branch);