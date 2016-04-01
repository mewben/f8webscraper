import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import acc from 'accounting';
import moment from 'moment-timezone';
import Dialog from 'material-ui/lib/dialog';

import * as AppActions from '../actions/AppActions';

class ListEncashments extends Component {

	static propTypes = {
		app: PropTypes.object,
		fetchEncashments: PropTypes.func,
		requestEncash: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			info: new Map(),
			open: false,
			type: ''
		};
	}

	componentWillMount() {
		this.fetchData();
	}

	fetchData() {
		this.props.fetchEncashments().payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						info: fromJS(res.payload)
					});
				}
			});
		this.setState({
			open: false
		});
	}

	_handleDialog(type) {
		this.setState({
			open: true,
			type: type
		});

		setTimeout(() => {
			this.refs.password.focus();
		}, 200);
	}

	_handleEncashment = (e) => {
		e.preventDefault();
		let password = this.refs.password.value;
		let type = this.state.type;

		this.props.requestEncash(type, password).payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					// call fetchEncashments
					this.fetchData();
				}
			});

	};

	_handleClose = () => {
		this.setState({
			open: false
		});
	};

	_renderEncash(item) {
		if (item.get('EncashedAt').get('Valid')) {
			return (
				<small>{moment(item.get('EncashedAt').get('Time')).tz('Asia/Manila').format('lll')}</small>
			);
		} else {
			return (
				<small className="label label-warning">Requested</small>
			);
		}
	}

	_renderList() {
		let { info } = this.state;

		if (info.size === 0) {
			return null;
		}

		return (
			<div className="well">
				<table className="table table-sm table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Date</th>
							<th>Type</th>
							<th className="right">Amount (Php)</th>
							<th className="right">Date Encashed</th>
						</tr>
					</thead>
					<tbody>
						{info.get('Trans') && info.get('Trans').map((item, i) => {
							return (
								<tr key={i}>
									<td>{i+1}.</td>
									<td><small>{moment(item.get('CreatedAt')).tz('Asia/Manila').format('lll')}</small></td>
									<td>{item.get('Type')}</td>
									<td className="right">{acc.formatNumber(item.get('Amount'), 2)}</td>
									<td className="right">{this._renderEncash(item)}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	_renderDialog() {
		let { open } = this.state;
		return (
			<Dialog
				title="Confirm Action"
				modal={false}
				onRequestClose={this._handleClose}
				open={open}
			>
				<p>Your account password is needed to proceed.</p>
				<form onSubmit={this._handleEncashment} className="row">
					<div className="col-sm-8">
						<input
							ref="password"
							type="password"
							className="form-control"
							placeholder="Account Password"
						/>
					</div>
					<div className="col-sm-4">
						<button type="submit" className="btn btn-block btn-primary">Submit</button>
					</div>
				</form>
			</Dialog>
		);
	}

	_renderWidgets() {
		let { info } = this.state;
		let { me } = this.props.app;
		let acc_disable_encashment = false;

		if (me.get('Status') === "disabled") {
			acc_disable_encashment = true;
		}

		if (info.size === 0) {
			return null;
		}

		let dr = info.get('Dr'),
			ipsb = info.get('Ipsb'),
			spsb = info.get('Spsb'),
			ind = info.get('Ind');

		let dr_disable = acc_disable_encashment || !dr || Number(dr) < 100,
			ipsb_disable = acc_disable_encashment || !ipsb,
			spsb_disable = acc_disable_encashment || !spsb,
			ind_disable = acc_disable_encashment || !ind || Number(ind) < 50;


		return (
			<div className="row">
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">Direct Referral Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(dr, 2)}</h4>
							<hr/>
							<button type="button" onClick={this._handleDialog.bind(this, 'dr')} className="btn btn-info btn-sm" disabled={dr_disable}>Request Encashment</button>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">Instant Package Sales Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(ipsb, 2)}</h4>
							<hr/>
							<button type="button" onClick={this._handleDialog.bind(this, 'ipsb')} className="btn btn-info btn-sm" disabled={ipsb_disable}>Request Encashment</button>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">System Package Sales Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(spsb, 2)}</h4>
							<hr/>
							<button type="button" onClick={this._handleDialog.bind(this, 'spsb')} className="btn btn-info btn-sm" disabled={spsb_disable}>Request Encashment</button>
						</div>
					</div>
				</div>
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">Indirect Referral Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(ind, 2)}</h4>
							<hr/>
							<button type="button" onClick={this._handleDialog.bind(this, 'ind')} className="btn btn-info btn-sm" disabled={ind_disable}>Request Encashment</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-12">
					{this._renderWidgets()}
					{this._renderList()}
					{this._renderDialog()}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app
	};
}


export default connect(mapStateToProps, AppActions)(ListEncashments);