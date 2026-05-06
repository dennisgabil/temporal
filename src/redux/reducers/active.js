const INITIAL_STATE = {
	activePage: 'Garnishee',
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