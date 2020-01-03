const getMicroUILoadedEvent = env =>
  new CustomEvent('microUILoaded', {
    detail: env,
  });

export default getMicroUILoadedEvent;
