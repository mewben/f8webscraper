import { fromJS, Map } from 'immutable';
import * as AT from '../constants/ActionTypes';

const initialState = {
	me: new Map(),
	flags: new Map({
		navOpen: false
	}),
	notif: new Map({
		title: '',
		message: '',
		level: 'success',
		position: 'tc',
		autoDismiss: 5,
		dismissible: false,
		action: null,
		actionState: false,
		show: false
	})
};

let me = localStorage.getItem('me');
if (me) {
	initialState.me = fromJS(JSON.parse(me));
}

export default function app(state = initialState, action) {
	let n = null;

	switch(action.type) {

		case AT.NAV_OPEN:
			return {
				...state,
				flags: state.flags.set('navOpen', true)
			};

		case AT.NAV_CLOSE:
			return {
				...state,
				flags: state.flags.set('navOpen', false)
			};

		case `${AT.AUTH_LOGIN}_FULFILLED`:
			localStorage.setItem('jwt', JSON.stringify(action.payload.JWT));
			localStorage.setItem('rft', action.payload.RefreshToken);
			localStorage.setItem('me', JSON.stringify(action.payload.Me));

			return {
				...state,
				me: state.me.merge(fromJS(action.payload.Me))
			};

		case `${AT.AUTH_LOGOUT}_FULFILLED`:
			localStorage.removeItem('jwt');
			localStorage.removeItem('rft');
			localStorage.removeItem('me');

			return {
				...state,
				me: new Map()
			};

		// show error message
		case `${AT.SHOW_REJECT}_REJECTED`:
		case `${AT.REQ_ENCASH}_REJECTED`:
		case `${AT.MEMBER_CPASSWORD}_REJECTED`:
			n = new Map({
				message: action.payload,
				level: 'error',
				show: true
			});

			return {
				...state,
				notif: state.notif.merge(n)
			};

		// show success message
		case `${AT.REQ_ENCASH}_FULFILLED`:
		case `${AT.MEMBER_CPASSWORD}_FULFILLED`:
			let msg = "Action Successful.";
			if (action.hasOwnProperty('meta') && action.meta.hasOwnProperty('msg')) {
				msg = action.meta.msg;
			}
			n = new Map({
				message: msg,
				level: 'success',
				show: true
			});
			return {
				...state,
				notif: state.notif.merge(n)
			};

		case AT.NOTIF_HIDE:
			return {
				...state,
				notif: state.notif.set('show', false)
			};

		default:
			return state;
	}

}