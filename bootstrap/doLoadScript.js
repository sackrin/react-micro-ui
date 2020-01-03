const doLoadScript = url =>
  new Promise((resolve, reject) => {
    const chaos = Math.random().toString(36).substring(7);
    const tag = document.createElement('script');
    tag.src = `${url}?c=${chaos}`;
    tag.onload = () => {
      resolve();
    };
    tag.onerror = () => {
      reject();
    };
    document.getElementsByTagName('head')[0].appendChild(tag);
  });

export default doLoadScript;
