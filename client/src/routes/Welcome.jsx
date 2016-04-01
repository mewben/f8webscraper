import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';

import * as AppActions from '../actions/AppActions';

class Welcome extends Component {

	static propTypes = {
		params: PropTypes.object,
		welcome: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			info: new Map(),
			error: ''
		};
	}

	componentWillMount() {
		let { params, welcome } = this.props;

		welcome(params.id).payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						info: fromJS(res.payload)
					});
				} else {
					this.setState({
						error: res.payload.message
					});
				}
			});
	}

	_renderActive(active) {
		if (!active) {
			return (
				<span className="label label-danger">Inactive</span>
			);
		} else {
			return (
				<span className="label label-primary">Active</span>
			);
		}
	}

	_renderForm() {
		let { info } = this.state;

		if (info.size === 0) {
			return null;
		}

		return (
			<div className="welcome">
				<div className="well">
					<table className="table no-border">
						<tbody>
							<tr>
								<td className="right">Member Name:</td>
								<td className="strong">{info.get('Name')}</td>
							</tr>
							<tr>
								<td className="right">Member ID:</td>
								<td className="strong">{info.get('Id')}</td>
							</tr>
							<tr>
								<td className="right">Sponsor:</td>
								<td className="strong">
									{info.get('Sponsor')}<br />
									<small>Sponsor ID: <strong>{info.get('SponsorId')}</strong></small>
								</td>
							</tr>
							<tr>
								<td className="right">Status:</td>
								<td>{this._renderActive(info.get('Active'))}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div id="register">
				<header className="text-center">
					<img src="/assets/img/logo.png" height="150" />
					<div className="logotext">ASCENTSO.COM</div>
				</header>
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="text-center">Welcome to Ascentso Enterprises!</h2>
							{this._renderForm()}
						</div>
					</div>
				</div>
				<footer>
					Copyright &copy; 2016. Ascentso.com <small>v1.0.20160103</small>
				</footer>
			</div>
		);
	}
}

export default connect(null, AppActions)(Welcome);