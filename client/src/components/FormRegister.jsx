import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Link from 'react-router/lib/Link';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import cl from 'classnames';

import Notification from './Notification';
import bindInput from '../hoc/bindInput';
import * as AppActions from '../actions/AppActions';
import { areAllNull } from '../utils/helpers';

class FormRegister extends Component {

	static contextTypes = {
		router: PropTypes.object
	};

	static propTypes = {
		__bindInput: PropTypes.func,
		checkUsername: PropTypes.func,
		checkSponsor: PropTypes.func,
		register: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			input: new Map({
				Username: '',
				Password: '',
				CPassword: '',
				Email: '',
				Name: '',
				Address: '',
				Dob: '',
				Mobile: '',
				SponsorId: '',
				Sponsor: ''
			}),
			flags: new Map({
				Username: null,
				Password: null,
				Email: null,
				Fullname: null,
				SponsorId: null,
				Policy: null
			}),
			open: false,
			submitClicked: false
		};
	}

	_checkUsername = () => {
		let username = this.state.input.get('Username');

		if (!username) {
			return;
		}

		this.props.checkUsername(username).payload.promise
			.then((res) => {
				if (res.hasOwnProperty('error')) {
					// error
					this.setState({
						flags: this.state.flags.set('Username', res.payload)
					});
				} else {
					// success
					let err = res.payload ? 'Username already exists.' : '';
					this.setState({
						flags: this.state.flags.set('Username', err)
					});
				}
			});
	};

	_checkSponsor = () => {
		let sponsor_id = this.state.input.get('SponsorId');

		if (!sponsor_id) {
			return;
		}

		this.props.checkSponsor(sponsor_id).payload.promise
			.then((res) => {
				if (res.hasOwnProperty('error')) {
					// error
					this.setState({
						flags: this.state.flags.set('SponsorId', res.payload.message),
						input: this.state.input.set('Sponsor', '')
					});
				} else {
					// success
					this.setState({
						flags: this.state.flags.set('SponsorId', ''),
						input: this.state.input.set('Sponsor', res.payload)
					});
				}
			});
	};


	_checkPassword = () => {
		let p = this.state.input.get('Password'),
			cp = this.state.input.get('CPassword'),
			err = '';

		if ((p !== '' || cp !== '') && p !== cp) {
			err = "Password doesn't match.";
		}

		this.setState({
			flags: this.state.flags.set('Password', err)
		});
	};

	_handleSubmit = () => {
		let { flags } = this.state;
		let input = this.state.input.toJS();
		let lastname = this.refs.lastname.value;
		let firstname = this.refs.firstname.value;
		let mi = this.refs.middlename.value;

		input.Name = lastname + ', ' + firstname + ' ' + mi;

		// Check all required
		if (!input.Username) {
			flags = flags.set('Username', true);
		} else {
			flags = flags.set('Username', null);
		}
		if (!input.Password) {
			flags = flags.set('Password', true);
		} else {
			flags = flags.set('Password', null);
		}
		if (!input.Email) {
			flags = flags.set('Email', true);
		} else {
			flags = flags.set('Email', null);
		}
		if (!input.Sponsor) {
			flags = flags.set('SponsorId', true);
		} else {
			flags = flags.set('SponsorId', null);
		}
		if (!lastname || !firstname) {
			flags = flags.set('Fullname', true);
		} else {
			flags = flags.set('Fullname', false);
		}

		// check if agreed to terms
		if (!this.refs.agree.checked) {
			flags = flags.set('Policy', true);
		} else {
			flags = flags.set('Policy', null);
		}

		// check if there are errors
		if (!areAllNull(flags.valueSeq().toJS())) {
			this.setState({
				flags: flags,
				open: true,
				submitClicked: true
			});
			return;
			//alert("Cannot submit. Fix the errors first.");
			//return;
		}
		/*// check if required values are present
		if (!input.Username || !input.Password || !input.SponsorId || !input.Email || !lastname || !firstname) {
			alert("Please fill out the required fields.");
			return;
		}*/

		// passed all precautions
		// submit
		this.props.register(input).payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.context.router.push('/welcome/'+res.payload);
				} else {
					// error
					// show notification error
					let err = {
						title: '',
						message: res.payload.message,
						level: 'error',
						position: 'tc',
						autoDismiss: 5,
						dismissable: false,
						action: null,
						actionState: false,
						show: true
					};

					this.refs.notify.addNotification(err);
				}
			});
	};

	_closeDialog = () => {
		this.setState({
			open: false
		});
	};

	_renderError(err) {
		return (
			<small className="error">{err}</small>
		);
	}

	_renderErrUsername() {
		let err = this.state.flags.get('Username');

		if (!err) {
			return null;
		}

		return this._renderError(err);
	}

	_renderErrPassword() {
		let err = this.state.flags.get('Password');

		if (!err) {
			return null;
		}

		return this._renderError(err);
	}

	_renderErrSponsor() {
		let err = this.state.flags.get('SponsorId');

		if (!err) {
			return null;
		}

		return this._renderError(err);
	}

	_renderSponsor() {
		let info = this.state.input.get('Sponsor');

		if (!info) {
			return null;
		}

		return (
			<small>Member: <strong className="upp">{info}</strong></small>
		);
	}

	_renderForm() {
		let { input, flags, submitClicked } = this.state;
		let { __bindInput } = this.props;
		let basecl = 'form-group row';

		let usernamecl = cl(basecl, {'has-danger': flags.get('Username')});
		let passwordcl = cl(basecl, {'has-danger': flags.get('Password')});
		//let emailcl = cl(basecl, {'has-danger': flags.get('Email')});
		let emailcl = cl(basecl, {'has-danger': submitClicked && !input.get('Email')});
		let fullnamecl = cl(basecl, {'has-danger': submitClicked && !this.refs.lastname.value});
		//let fullnamecl = cl(basecl, {'has-danger': flags.get('Fullname')});
		let sponsorcl = cl(basecl, {'has-danger': flags.get('SponsorId')});
		let policycl = cl(basecl, {'has-danger': flags.get('Policy')});

		return (
			<form>
				<h5>Account Information</h5>
				<div className={usernamecl}>
					<label className="col-sm-4 form-control-label">Username <span className="required">*</span></label>
					<div className="col-sm-8">
						<input
							type="text"
							className="form-control"
							placeholder="Username"
							value={input.get('Username')}
							onChange={__bindInput.bind(this, 'input', 'Username')}
							onBlur={this._checkUsername}
							autoCapitalize="off"
							autoFocus
						/>
						{this._renderErrUsername()}
					</div>
				</div>
				<div className={passwordcl}>
					<label className="col-sm-4 form-control-label">Password <span className="required">*</span></label>
					<div className="col-sm-8">
						<input
							type="password"
							className="form-control"
							placeholder="Password"
							value={input.get('Password')}
							onChange={__bindInput.bind(this, 'input', 'Password')}
							onBlur={this._checkPassword}
						/>
						<input
							type="password"
							className="form-control"
							placeholder="Confirm Password"
							value={input.get('CPassword')}
							onChange={__bindInput.bind(this, 'input', 'CPassword')}
							onBlur={this._checkPassword}
						/>
						{this._renderErrPassword()}
					</div>
				</div>
				<div className={emailcl}>
					<label className="col-sm-4 form-control-label">Email Address <span className="required">*</span></label>
					<div className="col-sm-8">
						<input
							type="text"
							className="form-control"
							placeholder="Email Address"
							value={input.get('Email')}
							onChange={__bindInput.bind(this, 'input', 'Email')}
						/>
					</div>
				</div>
				<h5>Personal Information</h5>
				<div className={fullnamecl}>
					<label className="col-sm-4 form-control-label">Full Name <span className="required">*</span></label>
					<div className="col-sm-3">
						<input
							type="text"
							ref="firstname"
							className="form-control"
							placeholder="First Name"
						/>
					</div>
					<div className="col-sm-2">
						<input
							type="text"
							ref="middlename"
							className="form-control"
							placeholder="Middle Name"
						/>
					</div>
					<div className="col-sm-3">
						<input
							type="text"
							ref="lastname"
							className="form-control"
							placeholder="Last Name"
						/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-4 form-control-label">Address</label>
					<div className="col-sm-8">
						<textarea
							className="form-control"
							placeholder="Address"
							value={input.get('Address')}
							onChange={__bindInput.bind(this, 'input', 'Address')}
						/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-4 form-control-label">Birth Date</label>
					<div className="col-sm-8">
						<input
							type="text"
							className="form-control"
							placeholder="MM-DD-YYYY"
							value={input.get('Dob')}
							onChange={__bindInput.bind(this, 'input', 'Dob')}
						/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-4 form-control-label">Contact #</label>
					<div className="col-sm-8">
						<input
							type="text"
							className="form-control"
							placeholder="Contact Number"
							value={input.get('Mobile')}
							onChange={__bindInput.bind(this, 'input', 'Mobile')}
						/>
					</div>
				</div>
				<h5>Membership Information</h5>
				<div className={sponsorcl}>
					<label className="col-sm-4 form-control-label">Sponsor's Member Id <span className="required">*</span></label>
					<div className="col-sm-8">
						<input
							type="text"
							className="form-control"
							placeholder="Sponsor's Member Id"
							value={input.get('SponsorId')}
							onChange={__bindInput.bind(this, 'input', 'SponsorId')}
							onBlur={this._checkSponsor}
						/>
						{this._renderSponsor()}
						{this._renderErrSponsor()}
					</div>
				</div>
				<div className={policycl}>
					<div className="col-sm-8 col-sm-offset-4">
						<div className="checkbox">
							<label>
								<input
									type="checkbox"
									ref="agree"
								/> I agree to the <Link to="http://www.ascentso.com/about-terms.html" target="_blank">Policies, Terms and Conditions</Link> of the company.
							</label>
						</div>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-8 col-sm-offset-4">
						<button
							type="button"
							onClick={this._handleSubmit}
							className="btn btn-block btn-lg btn-info"
						>Submit Registration</button>
					</div>
				</div>
			</form>
		);
	}

	_renderDialog() {
		let { open } = this.state;
		let actions = [
			<FlatButton
				label="Ok"
				onTouchTap={this._closeDialog}
			/>
		];
		return (
			<Dialog
				onRequestClose={this._closeDialog}
				actions={actions}
				open={open}
			>
				There are fields not complied. Please check.
			</Dialog>
		);
	}

	render() {
		return (
			<div id="register">
				<Notification ref="notify" style={false} noAnimation={false} />
				<header className="text-center">
					<img src="/assets/img/logo.png" height="150" />
					<div className="logotext">ASCENTSO.COM</div>
				</header>
				<div className="container">
					<div className="row">
						<div className="col-xs-12">
							<h2 className="text-center">Member Registration</h2>
							{this._renderForm()}
						</div>
					</div>
				</div>
				<footer>
					Copyright &copy; 2016. Ascentso.com <small>v1.0.20160103</small>
				</footer>
				{this._renderDialog()}
			</div>
		);
	}
}

export default bindInput(connect(null, AppActions)(FormRegister));