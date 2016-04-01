import React, { Component } from 'react';

export default (ComposedComponent) => class extends Component {

	// sets the state of input
	// must be immutable
	__bindInput(key, attr, e) {
		let state = {};

		state[key] = this.state[key].set(attr, e.currentTarget.value);
		this.setState(state);
	}

	// for checkbox
	__bindCheck(key, attr, e, checked) {
		let state = {};
		state[key] = this.state[key].set(attr, checked);
		this.setState(state);
	}
/*
	__bindNumber(key, attr, e) {
		let state = {},
			value = e.currentTarget.value;

		//if (!Number(value) && value != "") {
		if (Number(value) && value != "") {
			console.log("number");
			value = Number(value);
		}

		state[key] = this.state[key].set(attr, value);
		this.setState(state);
	}
*/
	render() {
		return (
			<ComposedComponent
				__bindInput={this.__bindInput}
				__bindCheck={this.__bindCheck}
				//__bindNumber={this.__bindNumber}
				{...this.props}
			/>
		);
	}

};
