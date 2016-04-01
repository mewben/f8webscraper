import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import * as AppActions from '../actions/AppActions';

class FormAccount extends Component {

	static propTypes = {
		app: PropTypes.object,
		changePassword: PropTypes.func
	};

	_changePassword = () => {
		let cpassword = this.refs.cpassword.value,
			npassword = this.refs.npassword.value,
			cnpassword = this.refs.cnpassword.value;

		if (npassword !== cnpassword) {
			alert("New Password did not match.");
			return;
		}

		this.props.changePassword(cpassword, npassword);
	};

	_renderAccount() {
		let { me } = this.props.app;

		console.log(me.toJS());
		return (
			<li className="list-group-item">
				<div className="panel-section">
					<div className="panel-desc">
						<div className="title">Account</div>
						<div className="details">Account Information</div>
					</div>
					<div className="panel-content">
						<div className="row">
							<div className="col-sm-12">
								<div className="form-group">
									<label>Member ID:</label>
									<div>{me.get('Id')}</div>
								</div>
								<div className="form-group">
									<label>Username:</label>
									<div>{me.get('Username')}</div>
								</div>
								<div className="form-group">
									<label>Full Name:</label>
									<div>{me.get('Name')}</div>
								</div>
								<div className="form-group">
									<label>Email Address:</label>
									<div>{me.get('Email')}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		);
	}

	_renderPassword() {
		return (
			<li className="list-group-item">
				<div className="panel-section">
					<div className="panel-desc">
						<div className="title">Account Password</div>
						<div className="details">Update your password.</div>
					</div>
					<div className="panel-content">
						<div className="row">
							<div className="col-sm-6">
								<div className="form-group">
									<label>Current Password</label>
									<input
										ref="cpassword"
										type="password"
										placeholder="Current Password"
										className="form-control"/>
								</div>
								<div className="form-group">
									<label>New Password</label>
									<input
										ref="npassword"
										type="password"
										placeholder="New Password"
										className="form-control"/>
								</div>
								<div className="form-group">
									<label>Confirm New Password</label>
									<input
										ref="cnpassword"
										type="password"
										placeholder="Confirm New Password"
										className="form-control"/>
								</div>
								<button type="button" onClick={this._changePassword} className="btn btn-info">Update Password</button>
							</div>
						</div>
					</div>
				</div>
			</li>
		);
	}

	_renderPersonal() {
		let { me } = this.props.app;

		return (
			<li className="list-group-item">
				<div className="panel-section">
					<div className="panel-desc">
						<div className="title">Personal</div>
						<div className="details">Personal Information</div>
					</div>
					<div className="panel-content">
						<div className="row">
							<div className="col-sm-6">
								<div className="form-group">
									<label>Birth Date:</label>
									<div>{me.get('Dob') || "-"}</div>
								</div>
							</div>
							<div className="col-sm-6">
								<div className="form-group">
									<label>Contact #:</label>
									<div>{me.get('Mobile') || "-"}</div>
								</div>
							</div>
							<div className="col-sm-12">
								<div className="form-group">
									<label>Address:</label>
									<div>{me.get('Address') || "-"}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		);
	}

	_renderMembership() {
		let { me } = this.props.app;

		return (
			<li className="list-group-item">
				<div className="panel-section">
					<div className="panel-desc">
						<div className="title">Membership</div>
						<div className="details">Membership Information</div>
					</div>
					<div className="panel-content">
						<div className="form-group">
							<label>Sponsor:</label>
							<div>{me.get('SponsorId') + ' - ' + me.get('Sponsor')}</div>
						</div>
						<div className="form-group">
							<label>Date Joined:</label>
							<div>{moment(me.get('CreatedAt')).tz('Asia/Manila').format('lll')}</div>
						</div>
					</div>
				</div>
			</li>
		);
	}

	render() {
		return (
			<div className="well">
				<ul className="list-group">
					{this._renderAccount()}
					{this._renderPassword()}
					{this._renderPersonal()}
					{this._renderMembership()}
				</ul>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app
	};
}

export default connect(mapStateToProps, AppActions)(FormAccount);