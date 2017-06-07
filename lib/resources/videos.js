import Resource from '../resource';

class Video extends Resource {
  constructor(api) {
    super(api, 'videos', ['all', 'retrieve', 'files']);
  }
};

export default Video;
