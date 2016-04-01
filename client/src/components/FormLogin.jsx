import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';

import * as AppActions from '../actions/AppActions';

import Icon from './Icon';

class FormLogin extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	static propTypes = {
		login: PropTypes.func
	};

	constructor(props) {
		super(props);

		let hasError = null;

		// check if there is a session msg
		if (localStorage.getItem('msg')) {
			hasError = localStorage.getItem('msg');
			localStorage.removeItem('msg');
		}

		this.state = {
			flags: new Map({
				hasError: hasError,
				isVerifying: false,
				loginText: 'Sign In'
			})
		};
	}

	_handleSubmit = (e) => {
		e.preventDefault();

		let credentials = {
			Username: this.refs.username.value,
			Password: this.refs.password.value,
			Tz: parseInt(Date.now() / 1000, 10)
		};

		let f = {
			isVerifying: true,
			loginText: 'Authenticating...'
		};

		this.setState({
			flags: this.state.flags.merge(f)
		});

		this.props.login(credentials).payload.promise
			.then((res) => {
				if (res.hasOwnProperty('error')) {
					f = new Map({
						isVerifying: false,
						loginText: 'Sign In',
						hasError: res.payload.message || res.payload
					});
					this.setState({
						flags: this.state.flags.merge(f)
					});
				} else {
					f = new Map({
						isVerifying: false,
						hasError: null,
						loginText: 'Authenticated'
					});
					this.setState({
						flags: this.state.flags.merge(f)
					});

					// transition to /
					// TODO transition to attempted path
					this.context.router.replace('/');
				}
			});
	};

	_renderError() {
		const { flags } = this.state,
			err = flags.get('hasError');

		if (!err) {
			return null;
		} else {
			return (
				<p className="required"><em>{err}</em></p>
			);
		}
	}

	_renderForm() {
		let { flags } = this.state;

		return (
			<form onSubmit={this._handleSubmit}>
				<h5>Member Login</h5>
				<hr/>
				{this._renderError()}
				<fieldset className="form-group">
					<div className="input-icon">
						<Icon name="person" />
						<input
							type="text"
							ref="username"
							className="form-control"
							placeholder="Username"
							autoCapitalize="off"
							autoFocus
						/>
					</div>
					<div className="input-icon">
						<Icon name="lock" />
						<input
							type="password"
							ref="password"
							className="form-control"
							placeholder="Password"
						/>
					</div>
				</fieldset>
				<button
					className="btn btn-info btn-block"
					disabled={flags.get('isVerifying')}
				>{flags.get('loginText')}</button>
			</form>
		);
	}

	render() {
		return (
			<div id="login">
				<div className="bg">
					<div className="container">
						<div className="row">
							<div className="col-md-7">
								<div className="co">
									<img src="/assets/img/logo.png" alt="Ascentso" height="150" />
									<div className="logotext">ASCENTSO.COM</div>
									<div className="lead">Welcome to Ascentso Enterprises!<br />
										<small><em>"Our road to success."</em></small>
									</div>
								</div>
							</div>
							<div className="col-md-5 text-center">
								{this._renderForm()}
								<Link to="/register">Not a member yet? Register here.</Link>
							</div>
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

export default connect(null, AppActions)(FormLogin);