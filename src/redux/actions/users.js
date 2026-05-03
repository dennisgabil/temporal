const setUsersData = (content) => {
  return {
    type: "SET_USERS_DATA",
    content,
  };
};

const setUsers = (users) => {
  return (dispatch) => {
    dispatch(setUsersData(users));
  };
};

export { setUsers };
