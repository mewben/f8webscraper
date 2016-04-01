import React, { Component } from 'react';
import { fromJS, Map, List } from 'immutable';
import acc from 'accounting';

import saveAs from '../utils/saveAs';
import { HOST } from 'config';

class NerdyForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			items: new List(),
			meta: new Map({
				total: 0,
				completed: 0,
				df: null,
				dt: null
			})
		};
	}

	_onSubmit = (e) => {
		e.preventDefault();

		let completed = 0;
		let apikey = this.refs.apikey.value;
		let queries = this.refs.queries.value;

		let q_array = queries.split("\n");
		let q_obj = [];
		q_array.map((item) => {
			if (item) {
				q_obj.push({
					query: item,
					res: "",
					err: null,
					done: false
				});
			}
		});

		let im_queries = fromJS(q_obj);
		let meta = {
			total: im_queries.size,
			completed: 0,
			df: new Date()
		};

		this.setState({
			items: im_queries,
			meta: this.state.meta.merge(fromJS(meta))
		});

		let resource = HOST + '/nerdy';
		im_queries.map((v, i) => {
			fetch(resource, {
				method: 'post',
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					Query: v.get('query'),
					ApiKey: apikey
				})
			}).then((response) => {
				return response.json();
			}).then((json) => {
				completed++;
				let res = '';
				let meta = {
					completed: completed
				};
				if (json && json.hasOwnProperty('Error')) {
					res = this.state.items.setIn([i, 'err'], json.Error);
				} else {
					res = this.state.items.setIn([i, 'res'], fromJS(json || []));
				}
				res = res.setIn([i, 'done'], true);

				if (completed == this.state.meta.get('total')) {
					meta.dt = new Date();
				}

				this.setState({
					items: res,
					meta: this.state.meta.merge(fromJS(meta))
				});
			}).catch((err) => {
				completed++;
				let res = this.state.items.setIn([i, 'err'], err.message);
				res = res.setIn([i, 'done'], true);

				let meta = {
					completed: completed
				};
				if (completed == this.state.meta.get('total')) {
					meta.dt = new Date();
				}
				this.setState({
					items: res,
					meta: this.state.meta.merge(fromJS(meta))
				});
			});
		});
	};

	_onExport = () => {
		let result = [];
		let { items } = this.state;
		let format = this.refs.format.value;

		if (!format) {
			format = "#res#";
		}

		// loop through the items
		items.map((item) => {
			let v = item.get('res');
			if (v) {
				let res = format;

				res = res.replace(new RegExp(/#res#/, 'g'), v);
				res = res.replace(new RegExp(/#0#/, 'g'), item.get('query'));

				result.push(res);
			}
		});

		result = result.join("\n");

		let blob = new Blob([result], {type: 'text/csv'}),
			url = URL.createObjectURL(blob);

		let filename = 'sites.txt';

		saveAs(url, filename);

	};

	_renderForm() {
		return (
			<form onSubmit={this._onSubmit}>
				<div className="form-group">
					<label>API KEY:</label>
					<input ref="apikey" type="text" className="form-control"/>
				</div>
				<div className="form-group">
					<label>Search Queries (1 per line):</label>
					<textarea ref="queries" type="text" rows={15} className="form-control"/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-info">Process</button>
				</div>
			</form>
		);
	}

	_renderStatus() {
		let { meta } = this.state;
		let total = meta.get('total');
		let completed = meta.get('completed');

		let perc = acc.formatNumber(completed/total*100, 0);

		if (perc == 100) {
			let lapse = (meta.get('dt') - meta.get('df'))/1000;
			return (
				<div>
					<em>Processing completed [{total}] in {lapse} seconds... Found {meta.get('found')}</em>
					<div className="form-group">
						<input ref="format" type="text" className="form-control" placeholder="Export format" autoFocus />
						<small className="text-muted">Ex. #res# - #0#</small>
					</div>
					<div className="form-group">
						<button className="btn btn-warning btn-sm" onClick={this._onExport}>Export Data</button>
					</div>
					<hr/>
				</div>
			);
		}
		return (
			<div>
				<h4>Processing {completed}/{total} ====> Found {meta.get('found')}.</h4>
				<progress className="progress progress-info" value={perc} max="100"></progress>
			</div>
		);
	}

	_renderList() {
		let { items } = this.state;

		if (items.size === 0) {
			return null;
		}

		return (
			<div>
				{this._renderStatus()}
				<table className="table table-sm">
					<thead>
						<tr>
							<th>#</th>
							<th>#0#</th>
							<th>#res#</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, i) => {
							let res = item.get('res');
							let err = item.get('err');
							if (err) {
								res = <em className="text-danger">{err}</em>;
							}
							return (
								<tr key={i}>
									<td>{i+1}.</td>
									<td>{item.get('query')}</td>
									<td>{res}</td>
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
			<div className="row">
				<div className="col-md-4">
					{this._renderForm()}
				</div>
				<div className="col-md-8">
					{this._renderList()}
				</div>
			</div>
		);
	}
}

export default NerdyForm;