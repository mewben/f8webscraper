import 'isomorphic-fetch';

import { HOST, EP } from 'config';
let jwt = {};

function _isObject(obj) {
	return obj === Object(obj);
}

// converts object to query parameters
function _serialize(obj) {
	if (!_isObject(obj)) { return obj; }
	var pairs = [];
	for (var key in obj) {
		if (obj[key] != null) {
			pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
		}
	}
	return pairs.join('&');
}

// unAuthenticated
function _unAuthenticated() {
	localStorage.removeItem('jwt');
	localStorage.removeItem('rft');
	localStorage.removeItem('me');
	localStorage.setItem('msg', 'Your session has expired.');
	window.location = "/login";
}

function _checkExpiry() {
	jwt = JSON.parse(localStorage.getItem('jwt')) || {};
	return new Promise((resolve, reject) => {
		if (!jwt) {
			return reject(new Error("No Token Present."));
		}

		if (jwt.Exp < Date.now()) {
			// Refresh token
			let rft = localStorage.getItem('rft');
			let options = {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					GrantType: 'refresh_token',
					ClientId: 'local',
					RefreshToken: rft,
					Tz: parseInt(Date.now() / 1000, 10)
				})
			};
			fetch(HOST + '/auth/delegation', options)
				.then((res) => {
					if (res.status > 400) {
						throw new Error(res.statusText);
					}
					if (res.ok) {
						return res.json();
					} else {
						return res.json()
							.then((err) => {
								throw new Error(err.Error);
							});
					}
				}).then((json) => {
					localStorage.setItem('rft', json.RefreshToken);
					localStorage.setItem('jwt', JSON.stringify(json.JWT));
					jwt = json.JWT;
					resolve();
				}).catch((err) => {
					_unAuthenticated();
					reject(err.message);
				});
		} else {
			resolve();
		}
	});
}

function _api(method, resource, body, query) {
	return new Promise((resolve, reject) => {
		let que = _serialize(query) || "";
		if (que) {
			que = "?" + que;
		}

		let options = {
			method: method,
			headers: new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + jwt.Token
			})
		};
		if (body) {
			options.body = JSON.stringify(body);
		}

		fetch(EP + resource + que, options)
			.then((res) => {
				if (res.status > 400) {
					throw new Error(res.statusText);
				}
				if (res.ok) {
					return resolve(res.json());
				} else {
					return res.json()
						.then((err) => {
							throw new Error(err.Error);
						});
				}
			}).catch((err) => {
				return reject(err.message);
			});
	});
}

function _request(method, resource, body, query) {
	return new Promise((resolve, reject) => {
		_checkExpiry()
			.then(() => {
				return _api(method, resource, body, query);
			}).then((res) => {
				return resolve(res);
			}).catch((err) => {
				return reject(err);
			});
	});
}

const ajax = {

	authenticate2: function(credentials) {
		console.log("credentials", credentials);
		return fetch('https://public-api.wordpress.com/rest/v1.1/sites/103139382')
			.then((res) => {
				console.log(res);
			});
	},

	// authenticate
	authenticate: function(credentials) {
		return fetch(HOST + '/auth/login', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		}).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				return res.json()
					.then((err) => {
						throw new Error(err.Error);
					});
			}
		}).then((json) => {
			return json;
		});
	},

	logout: function() {
		return fetch(HOST + '/auth/logout', {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({Rft: localStorage.getItem('rft')})
		}).then(() => {
			return true;
		});
	},

	// normal GET request
	getRequest: function(resource) {
		return fetch(HOST + resource, {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				return res.json()
					.then((err) => {
						throw new Error(err.Error);
					});
			}
		}).then((json) => {
			return json;
		});
	},

	postRequest: function(resource, payload) {
		return fetch(HOST + resource, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				return res.json()
					.then((err) => {
						throw new Error(err.Error);
					});
			}
		}).then((json) => {
			return json;
		});
	},


	download: function(resource, body) {
		return new Promise((resolve, reject) => {
			_checkExpiry()
				.then(() => {
					let options = {
						method: 'post',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + jwt.Token
						},
						body: JSON.stringify(body)
					};
					return fetch(EP + resource, options);
				}).then((res) => {
					if (res.status > 400) {
						throw new Error(res.statusText);
					}
					return res.text();
				}).then((res) => {
					resolve(res);
				}).catch((err) => {
					reject(err.message);
				});
		});
	},

	get: function(resource, query) {
		return _request('get', resource, null, query);
	},

	post: function(resource, body) {
		return _request('post', resource, body);
	},

	put: function(resource, body) {
		return _request('put', resource, body);
	},

	destroy: function(resource, body) {
		return _request('delete', resource, body);
	}
};

export default ajax;