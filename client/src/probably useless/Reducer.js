const Reducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH':
            return {
                ...state,
                user: state.user
            }
        case 'SET_PROFILE':
            return {
                ...state,
                user: action.payload.user,
                isLoaded: action.payload.isLoaded,
            };
        case 'REMOVE_POST':
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload)
            };
        default:
            return state;
    }
};

export default Reducer;