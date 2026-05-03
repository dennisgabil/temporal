const setActivePageData = (content) => {
	return {
		type: "SET_ACTIVE_PAGE_DATA",
		content
	}
}

const setActivePage = (activePage) => {
	return (dispatch) => {
		dispatch(
			setActivePageData(
				{ activePage: activePage }
				)
			)
	}
}



export {
	setActivePage
}