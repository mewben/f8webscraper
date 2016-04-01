import ajax from '../utils/ajax';
import * as AT from '../constants/ActionTypes';

export function openNav() {
	return {
		type: AT.NAV_OPEN
	};
}

export function closeNav() {
	return {
		type: AT.NAV_CLOSE
	};
}

export function login(credentials) {
	return {
		type: AT.AUTH_LOGIN,
		payload: {
			promise: ajax.authenticate(credentials)
		}
	};
}

export function logout() {
	return {
		type: AT.AUTH_LOGOUT,
		payload: {
			promise: ajax.logout()
		}
	};
}

export function hideNotification() {
	return {
		type: AT.NOTIF_HIDE
	};
}

export function checkUsername(username) {
	return {
		type: AT.NOOP,
		payload: {
			promise: ajax.getRequest('/members/check/username/'+username)
		}
	};
}

// returns the Name of the sponsor
export function checkSponsor(sponsor_id) {
	return {
		type: AT.NOOP,
		payload: {
			promise: ajax.getRequest('/members/check/id/'+sponsor_id)
		}
	};
}

// submit registration
export function register(payload) {
	return {
		type: AT.NOOP,
		payload: {
			promise: ajax.postRequest('/members/register', payload)
		}
	};
}

// get data for welcome page
export function welcome(id) {
	return {
		type: AT.NOOP,
		payload: {
			promise: ajax.getRequest('/members/welcome/' + id)
		}
	};
}

export function fetchSlots() {
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.get('/slots')
		}
	};
}

export function activateSlot(slot_id) {
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.post('/slots/activate/'+slot_id)
		}
	};
}

export function dashboard() {
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.get('/dashboard')
		}
	};
}

export function fetchEncashments() {
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.get('/encashments')
		}
	};
}

export function requestEncash(type, password) {
	return {
		type: AT.REQ_ENCASH,
		payload: {
			promise: ajax.post('/request/encash/'+type, {Password: password})
		},
		meta: {
			msg: 'Encashment request received.'
		}
	};
}

export function changePassword(cpassword, npassword) {
	return {
		type: AT.MEMBER_CPASSWORD,
		payload: {
			promise: ajax.post('/change-password', {Old: cpassword, New: npassword})
		},
		meta: {
			msg: 'Password changed successfully.'
		}
	};
}

export function fetchNetwork(id) {
	let resource = '/network';
	if (id) {
		resource = '/network/'+id;
	}
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.get(resource)
		}
	};
}

export function fetchPurchases() {
	return {
		type: AT.SHOW_REJECT,
		payload: {
			promise: ajax.get('/purchases')
		}
	};
}