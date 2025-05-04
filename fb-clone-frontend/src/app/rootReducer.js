import { combineReducers } from 'redux';
import userReducer from '../features/userSlice';
import modalReducer from '../features/modalSlice';
import postReducer from '../features/postSlice';
import socketReducer from '../features/socketSlice';
import usersReducer from '../features/usersSlice';

export default combineReducers({
	user: userReducer,
	modal: modalReducer,
	post: postReducer,
	socket: socketReducer,
	users: usersReducer,
});
