import { combineReducers } from 'redux';
import users from './reducers/users';
import activePage from './reducers/active';

const singleReducer = combineReducers({
	users,
	activePage
});

export default singleReducer;