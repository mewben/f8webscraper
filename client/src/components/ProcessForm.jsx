import React, { Component } from 'react';
import { fromJS, List, Map } from 'immutable';
import 'isomorphic-fetch';
import acc from 'accounting';

import saveAs from '../utils/saveAs';
import { HOST } from 'config';

class ProcessForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			urls: new List(),
			meta: new Map({
				total: 0,
				completed: 0,
				groups: 0,
				found: 0,
				df: null,
				dt: null
			})
		};
	}

	_onSubmit = (e) => {
		e.preventDefault();

		let completed = 0;
		let urls = this.refs.urls.value;
		let pattern = this.refs.pattern.value;
		//let pattern = `_pop\.push\(\[['"]siteId['"], ([\w]+)\]\)`;
		//
		//		let _format = _clone(format);

		// count the number of groups in this pattern
		let groups = (new RegExp(pattern + '|')).exec('').length + 1; // include "#url#" and "the pattern istelf"

		let urls_array = urls.split("\n");
		let urls_obj = [];
		urls_array.map((item) => {
			if (item) {
				urls_obj.push({
					url: item,
					res: [],
					err: null,
					done: false
				});
			}
		});

		let im_urls = fromJS(urls_obj);
		let meta = {
			total: im_urls.size,
			completed: 0,
			groups: groups,
			df: new Date()
		};
		this.setState({
			urls: im_urls,
			meta: this.state.meta.merge(fromJS(meta))
		});

		let resource = HOST + '/process';
		im_urls.map((v, i) => {
			fetch(resource, {
				method: 'post',
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					Url: v.get('url'),
					Pattern: pattern
				})
			}).then((response) => {
				return response.json();
			}).then((json) => {
				completed++;
				let res = '';
				let meta = {
					completed: completed,
					found: this.state.meta.get('found')
				};
				if (json && json.hasOwnProperty('Error')) {
					res = this.state.urls.setIn([i, 'err'], json.Error);
				} else {
					res  = this.state.urls.setIn([i, 'res'], fromJS(json || []));
					if (json) {
						meta.found = meta.found + 1;
					}
				}
				res = res.setIn([i, 'done'], true);

				if (completed == this.state.meta.get('total')) {
					meta.dt = new Date();
				}
				//let urls = this.state.urls.set(url, fromJS(json));
				this.setState({
					urls: res,
					meta: this.state.meta.merge(fromJS(meta))
				});
			}).catch((err) => {
				completed++;
				//let urls = this.state.urls.set(url, fromJS(err));
				let res = this.state.urls.setIn([i, 'err'], err.message);
				res = res.setIn([i, 'done'], true);

				let meta = {
					completed: completed
				};
				if (completed == this.state.meta.get('total')) {
					meta.dt = new Date();
				}
				this.setState({
					urls: res,
					meta: this.state.meta.merge(fromJS(meta))
				});
			});
		});
	};

	_onExport = () => {
		let { urls } = this.state;
		let format = this.refs.format.value;
		let result = [];

		if (!format) {
			format = "#url#,#0#";
		}

		// get array of tokens
		// ["{url}", "{0}"]
		let tokens = format.match(/(#.*?#)/g);
		// get inside {}
		// ['url', '0']
		let values = tokens.map((item) => {
			return item.slice(1, -1);
		});

		// loop through the results
		urls.map((url) => {
			let v = url.get('res');
			if (v.size != 0) {
				let res = format;

				values.map((value, ii) => {
					if (value == "url") {
						res = res.replace(new RegExp(tokens[ii], 'g'), url.get('url'));
					} else {
						res = res.replace(new RegExp(tokens[ii], 'g'), v.get(value));
					}
				});
				result.push(res);
			}
			/*let res = _clone(format);
			values.map((value, ii) => {
				if (url) {
					if (value == "url") {
						res = res.replace(new RegExp(tokens[ii], 'g'), i);
					} else {
						res = res.replace(new RegExp(tokens[ii], 'g'), i);
					}
				}
			});
			result.push(res);*/
		});

		result = result.join("\n");

		let blob = new Blob([result], {type: 'text/csv'}),
			url = URL.createObjectURL(blob);

		let filename = 'test.txt';

		saveAs(url, filename);
	};

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
						<small className="text-muted">Ex. #url# - #0#,#1#</small>
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
				<h4>Processing {completed}/{total} =======> Found {meta.get('found')}.</h4>
				<progress className="progress progress-info" value={perc} max="100"></progress>
			</div>
		);
	}

	_renderForm() {
		return (
			<form onSubmit={this._onSubmit}>
				<div className="form-group">
					<label>Pattern to search (Regex)</label>
					<input ref="pattern" type="text" className="form-control" />
					<span className="text-muted">_pop\.push\(\[['"]siteId['"], ([\w]+)\]\)</span>
				</div>
				<div className="form-group">
					<label>URLs (1 each line)</label>
					<textarea ref="urls" rows={15} className="form-control" />
				</div>
				<button type="submit" className="btn btn-info">Process</button>
			</form>
		);
	}

	_renderTHead() {
		let { meta } = this.state;
		let th = [];

		for (let i = 0, l = meta.get('groups'); i < l; i++) {
			if (i == 0) {
				th.push(<th key={i}>#url#</th>);
			} else {
				th.push(<th key={i}>#{i-1}#</th>);
			}
		}

		return <tr><td>#</td>{th}</tr>;
	}

	_renderList() {
		let { urls, meta } = this.state;

		if (urls.size === 0) {
			return null;
		}

		return (
			<div>
				{this._renderStatus()}
				<table className="table table-sm">
					<thead>
						{this._renderTHead()}
					</thead>
					<tbody>
						{urls.map((item, i) => {
							let td = [];

							for (let x = 0, l = meta.get('groups')-1; x < l; x++) {
								let done = item.get('done');
								let v = item.get('res').get(x);
								if (!done) {
									v = <em className="text-muted">Processing</em>;
								} else if (item.get('err')) {
									v = <em className="text-danger">{item.get('err')}</em>;
								}
								td.push(<td key={x}>{v}</td>);
							}
							return (
								<tr key={i}>
									<td>{i+1}.</td>
									<td>{item.get('url')}</td>
									{td}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);

		/*let urls2 = urls.toJS();

		return (
			<div>
				{this._renderStatus()}
				<ul className="list-group">
					{Object.keys(urls2).map((item, i) => {
						{n++}
						return (
							<li key={i} className="list-group-item">
								<span>{n}. {item}</span>
								<span className="pull-xs-right">
									<small>
										<em>{urls2[item]}</em>
									</small>
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		);*/
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

export default ProcessForm;
