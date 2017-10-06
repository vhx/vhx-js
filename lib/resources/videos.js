import Resource from '../resource';

class Video extends Resource {
  constructor(api) {
    super(
      api,
      'videos',
      process.env.NODE_BUILD ?
        ['all', 'retrieve', 'files', 'create', 'update'] :
        ['all', 'retrieve', 'files']
    );
  }
};

export default Video;
