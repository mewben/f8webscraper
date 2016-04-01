import React, { Component, PropTypes } from 'react';
import { fromJS, List, Map } from 'immutable';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import acc from 'accounting';

import * as AppActions from '../actions/AppActions';

class ListSlots extends Component {

	static propTypes = {
		fetchSlots: PropTypes.func,
		activateSlot: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			meta: new Map(),
			items: new List()
		};
	}

	componentWillMount() {
		this.props.fetchSlots().payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						meta: fromJS(res.payload.Meta),
						items: fromJS(res.payload.Items)
					});
				}
			});
	}

	_activate(slot_id, index) {
		let { items, meta } = this.state;

		if(!confirm("Proceed Activation?")) {
			return;
		}

		this.props.activateSlot(slot_id).payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					let old_item = items.get(index);
					let new_item = old_item.set('EncodedAt', fromJS(res.payload));
					let new_meta = new Map({
						Active: meta.get('Active') + 1,
						Inactive: meta.get('Inactive') - 1
					});
					this.setState({
						items: items.set(index, new_item),
						meta: meta.merge(new_meta)
					});
				}
			});
	}

	_renderActivate(item, index) {
		if (item.get('EncodedAt').get('Valid')) {
			return <small>{moment(item.get('EncodedAt').get('Time')).tz('Asia/Manila').format('lll')}</small>;
		} else {
			// button to activate slot
			return <button type="button" onClick={this._activate.bind(this, item.get('Id'), index)} className="btn btn-sm btn-info">Register</button>;
		}
	}

	_renderSummary() {
		let { meta } = this.state;

		if (meta.size === 0) {
			return null;
		}

		return (
			<div className="row">
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">Registered Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(meta.get('Active'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-danger">
						<div className="panel-heading">
							<h3 className="panel-title">Available Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(meta.get('Inactive'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-warning">
						<div className="panel-heading">
							<h3 className="panel-title">Rewarded Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(meta.get('Rewarded'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-primary">
						<div className="panel-heading">
							<h3 className="panel-title">Total Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(meta.get('Total'), 0)}</h2>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderList() {
		let { items } = this.state;

		if (items.size === 0) {
			return null;
		}

		return (
			<div className="well">
				<table className="table table-sm table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Package Registration Code</th>
							<th>Date Registered</th>
							<th>Date Rewarded</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, i) => {
							return (
								<tr key={i}>
									<td>{i+1}.</td>
									<td><code>{item.get('RegCode')}</code></td>
									<td>{this._renderActivate(item, i)}</td>
									<td><small>{item.get('TransRewardId').get('Valid') && moment(item.get('RewardedAt').get('Time')).tz('Asia/Manila').format('lll')}</small></td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	render() {
		return (
			<div className="container-fluid">
				{this._renderSummary()}
				<div className="row">
					<div className="col-sm-12">
						<hr/>
						{this._renderList()}
						<hr/>
						<small>
							<strong>*</strong><em>Only a maximum of 10 packages can be activated per day.</em>
						</small>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(null, AppActions)(ListSlots);