import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import acc from 'accounting';

import * as AppActions from '../actions/AppActions';
import Icon from './Icon';
import Tree from './Tree';
import Branch from './Branch';

class ListNetwork extends Component {

	static propTypes = {
		fetchNetwork: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			data: new Map()
		};
	}

	componentWillMount() {
		this.props.fetchNetwork().payload.promise
			.then((res) => {
				if (!res.hasOwnProperty('error')) {
					this.setState({
						data: fromJS(res.payload)
					});
				}
			});
	}

	_renderList() {
		let { data } = this.state;

		return (
			<div className="well">
				<h5 className="pd-tb">List of Direct Referrals</h5>
				<table className="table table-sm table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Member ID</th>
							<th>Name</th>
							<th>Date Activated</th>
						</tr>
					</thead>
					<tbody>
						{data.get('Items') && data.get('Items').map((item, i) => {
							return (
								<tr key={i}>
									<td>{i+1}.</td>
									<td>{item.get('Id')}</td>
									<td>{item.get('Name')}</td>
									<td>{moment(item.get('ActivatedAt')).tz('Asia/Manila').format('lll')}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	_renderList3() {
		let { data } = this.state;
		return (
			<Tree
				branches={data.get('Items') || []}
				level={1}
			/>
		);
	}

	_renderList2() {
		return (
			<ul className="tree">
				<Branch
					name="Testing Name"
					level={2}
				/>
				<li className="branch">
					<div className="leaf">
						<Icon name="right" size="20" />
						Tree 1
						<div className="pull-xs-right text-muted"><small>Level 1</small></div>
					</div>
					<ul className="tree">
						<li>
							<div className="leaf">
								<div className="inline">
									<div className="uil-ripple-css" style={{transform:"scale(0.1)"}}>
										<div></div>
										<div></div>
									</div>
								</div>
								<div className="pull-xs-right">Level 2</div>
							</div>
							<ul className="tree">
								<li>
									<div className="leaf">
										Tree 111
										<div className="pull-xs-right">Level 3</div>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li className="branch open">
					<div className="leaf">
						<Icon name="right" size="20" />
						Tree 1
						<div className="pull-xs-right">Level 1</div>
					</div>
					<ul className="tree">
						<li>
							<div className="leaf">Test</div>
						</li>
					</ul>
				</li>
			</ul>
		);
	}

	render() {
		let { data } = this.state;

		if (data.size === 0) {
			return null;
		}

		return (
			<div className="row">
				<div className="col-sm-3">
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">No. of Direct</h3>
						</div>
						<div className="panel-body text-center">
							<h4>{acc.formatNumber(data.get('Direct'), 0)}</h4>
						</div>
					</div>
					<div className="panel panel-success">
						<div className="panel-heading">
							<h3 className="panel-title">No. of Indirect</h3>
						</div>
						<div className="panel-body text-center">
							<h4>{acc.formatNumber(data.get('Indirect'), 0)}</h4>
						</div>
					</div>
					<div className="panel panel-warning">
						<div className="panel-heading">
							<h3 className="panel-title">Total Network</h3>
						</div>
						<div className="panel-body text-center">
							<h4>{acc.formatNumber(data.get('Total'), 0)}</h4>
						</div>
					</div>
				</div>
				<div className="col-sm-9">
					{this._renderList3()}
				</div>
			</div>
		);
	}
}

export default connect(null, AppActions)(ListNetwork);