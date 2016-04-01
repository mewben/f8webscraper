import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import acc from 'accounting';

import TopNav from '../partials/TopNav';
import * as AppActions from '../actions/AppActions';

class Dashboard extends Component {

	static propTypes = {
		app: PropTypes.object,
		dashboard: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			info: new Map()
		};
	}

	componentWillMount() {
		// query data
		this.props.dashboard().payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						info: fromJS(res.payload)
					});
				}
			});
	}

	_renderWidgets() {
		let { info } = this.state;

		return (
			<div className="row">
				{this._renderAlert()}
				<div className="col-sm-4">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Active Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(info.get('Slots').get('Meta').get('Active'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Rewarded Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(info.get('Slots').get('Meta').get('Rewarded'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-4">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">Available Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h2>{acc.formatNumber(info.get('Slots').get('Meta').get('Inactive'), 0)}</h2>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-warning">
						<div className="panel-heading">
							<h3 className="panel-title">Direct Referrals</h3>
						</div>
						<div className="panel-body text-center">
							<h4>{acc.formatNumber(info.get('DrCount'), 0)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-warning">
						<div className="panel-heading">
							<h3 className="panel-title">Direct Referral Packages</h3>
						</div>
						<div className="panel-body text-center">
							<h4>{acc.formatNumber(info.get('DrSlotsCount'), 0)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-12 pd-t">
					<h6>Available for Encashment</h6>
					<hr/>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-info">
						<div className="panel-heading">
							<h3 className="panel-title">Instant Package Sales Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(info.get('Earnings').get('Ipsb'), 2)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-info">
						<div className="panel-heading">
							<h3 className="panel-title">System Package Sales Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(info.get('Earnings').get('Spsb'), 2)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-info">
						<div className="panel-heading">
							<h3 className="panel-title">Direct Referral Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(info.get('Earnings').get('Dr'), 2)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-6">
					<div className="panel panel-info">
						<div className="panel-heading">
							<h3 className="panel-title">Indirect Referral Bonus</h3>
						</div>
						<div className="panel-body text-center">
							<h4><small className="text-muted">Php</small> {acc.formatNumber(info.get('Earnings').get('Ind'), 2)}</h4>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderSummary() {
		let { me } = this.props.app;
		let { info } = this.state;

		return (
			<div className="row">
				<div className="col-sm-8">
					{this._renderWidgets()}
				</div>
				<div className="col-sm-4">
					<div className="panel panel-info">
						<div className="panel-body">
							<section className="text-center">
								<figure className="user-image">
									<div className="img"></div>
								</figure>
								<h5>{me.get('Name')}</h5>
								<p>
									<small>Member ID: <strong>{me.get('Id')}</strong></small><br />
									<span className="label label-success">Active</span>
								</p>
							</section>
							<ul className="list-group text-left">
								<li className="list-group-item">
									<div className="pull-xs-right strong">{acc.formatNumber(info.get('Slots').get('Meta').get('Total'), 0)}</div>
									Total Packages
								</li>
								<li className="list-group-item">
									<div className="pull-xs-right strong">{acc.formatNumber(info.get('Earnings').get('Total'), 2)}</div>
									Total Earnings
								</li>
								<li className="list-group-item">
									<div className="pull-xs-right strong">{acc.formatNumber(info.get('Earnings').get('Available'), 2)}</div>
									Total Available Earnings
								</li>
							</ul>
							<hr/>
							<Link to="/profile" className="btn btn-block btn-info">Change Password</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderWarning() {
		let { me } = this.props.app;

		if (me.get('Status') === 'disabled') {
			return (
				<div className="alert alert-danger">Alert! Your business account needs maintenance. Encashment is disabled until you purchase at least 1 business package.</div>
			);
		}

		if (me.get('Status') === 'warning') {
			return (
				<div className="alert alert-warning">You only have {me.get('DaysRemain')} days left to maintain your account. If you can not purchase at least 1 business package, you can no longer avail any bonuses from the company.</div>
			);
		}
	}

	_renderAlert() {
		return (
			<div className="col-sm-12">
				{this._renderWarning()}
				<div className="alert alert-success">
					<p>Welcome to Ascentso Enterprises! <em>Our road to success.</em></p>
				</div>
			</div>
		);
	}

	render() {
		if (this.state.info.size === 0) {
			return null;
		}
		return (
			<div className="main-content">
				<TopNav title="Dashboard" />
				<div className="content">
					{this._renderSummary()}
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

export default connect(mapStateToProps, AppActions)(Dashboard);