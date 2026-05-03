const INITIAL_STATE = {
	activePage: 'Load Revenue',
}

export default (state = INITIAL_STATE, action={}) => {
	switch(action.type) {
	case "SET_ACTIVE_PAGE_DATA":
		return {
			...state,
			...action.content
		};
	default:
		return state;
	}
};