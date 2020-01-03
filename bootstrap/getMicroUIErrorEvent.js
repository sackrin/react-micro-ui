const getMicroUIErrorEvent = env =>
  new CustomEvent('microUIError', {
    detail: env,
  });

export default getMicroUIErrorEvent;
