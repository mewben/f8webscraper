import React, { Component, PropTypes } from 'react';
import { fromJS, List, Map } from 'immutable';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import acc from 'accounting';

import * as AppActions from '../actions/AppActions';

class ListPurchases extends Component {

	static propTypes = {
		fetchPurchases: PropTypes.func
	};

	constructor(props) {
		super(props);

		this.state = {
			meta: new Map(),
			items: new List()
		};
	}

	componentWillMount() {
		this.props.fetchPurchases().payload.promise
			.then((res) => {
				this.setState({
					meta: fromJS(res.payload.Meta),
					items: fromJS(res.payload.Items || [])
				});
			});
	}

	render() {
		let { items, meta } = this.state;

		if (meta.size === 0) {
			return <p>Loading...</p>;
		}

		return (
			<div className="well">
				<table className="table table-sm table-hover">
					<thead>
						<tr>
							<th>Date</th>
							<th>Invoice #</th>
							<th>Particulars</th>
							<th className="right">Amount (Php)</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, i) => {
							return (
								<tr key={i}>
									<td><small>{moment(item.get('Date')).tz('Asia/Manila').format('lll')}</small></td>
									<td>{item.get('InvoiceNo')}</td>
									<td>
										<ul>
										{item.get('Particulars').map((p, ii) => {
											return (
												<li key={ii}>{p.get('Name')}</li>
											);
										})}
										</ul>
									</td>
									<td className="right">{acc.formatNumber(item.get('Amount'), 2)}</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							<td colSpan="3" className="right">Total:</td>
							<td className="right"><strong>{acc.formatNumber(meta.get('TotalAmount'), 2)}</strong></td>
						</tr>
					</tfoot>
				</table>
			</div>
		);
	}
}

export default connect(null, AppActions)(ListPurchases);
