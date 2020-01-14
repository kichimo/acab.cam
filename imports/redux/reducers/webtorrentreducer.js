import { CREATE_TORRENTCLIENT, ADD_VIDEO } from "../actionTypes";

const initialState = {
  client: new window.WebTorrent(),
  videos: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_TORRENTCLIENT: {
      return {
        ...state,
        client: action.client,
      };
    }
    case ADD_VIDEO:{
      return{
        ...state,
        videos: {
          ...state.videos,
          [action._id]: {
            ...state.videos[action._id],
            file:  action.file
          }
        }
      }
    }
    default:
      return state;
  }
}
