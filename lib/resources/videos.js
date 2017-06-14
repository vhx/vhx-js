import Resource from '../resource';

class Video extends Resource {
  constructor(api) {
    if (process.env.NODE_BUILD) {
      super(api, 'videos', ['all', 'retrieve', 'files', 'create', 'update']);
    } else {
      super(api, 'videos', ['all', 'retrieve', 'files']);
    }
  }
};

export default Video;
