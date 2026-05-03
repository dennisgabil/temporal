const INITIAL_STATE = {
	users: null,
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
	case "SET_USERS_DATA":
		return {
			...state,
			...action.content
		};
	default:
		return state;
	}
};