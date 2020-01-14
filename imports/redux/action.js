import { CREATE_TORRENTCLIENT, ADD_VIDEO } from "./actionTypes";

export const createClient = client => ({
  type: CREATE_TORRENTCLIENT,
  client: client
});


export const addVideo = (_id, file) => ({
    type: ADD_VIDEO,
    _id: _id,
    file: file
  });
  