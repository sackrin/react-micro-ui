const embedComponent = (name, env, config, props, el) => {
  // Determine the correct api and asset values based on
  const apiUrl = env.api?.url ? env.api?.url : api.url;
  const apiPath = env.api?.path ? env.api?.path : api.path;
  const assetUrl = env.assets?.url ? env.assets?.url : apiUrl;
  const assetTarget = env.assets?.target ? env.assets?.target : assets.target;
  const assetEnv = env.assets?.env ? env.assets?.env : {};
  // Construct the props to be passed to the rendered component
  const _props = {
    name,
    apiUrl,
    apiPath,
    assetUrl: assetUrl || apiUrl,
    assetTarget,
    ...assetEnv,
    ...props,
  };
  // Return the built component
  return ('<div data-microui-library="' + config.name + '" data-microui-component="' + name + '">' +
    '' + el + '' +
    '</div>' +
    '<script type="application/javascript">' +
    ' (function(n, c, p, t) {' +
    '  var w = window, m = function(e){' +
    '   if (e.detail.name === n && w[n] && w[n].Hydrate) {' +
    '    w[n].Hydrate(document.querySelector(`div[data-microui-component="' + name + '"] div[data-reactroot]`),c,p,t);' +
    '   };' +
    '  };' +
    '  if (w[config.name]) { m(); } else { w.addEventListener(\'microUILoaded\', m); }' +
    '  var d = document.getElementById(`' + config.name + 'Library`);' +
    '  if (d === null || d.length === 0) {' +
    '   var tag = document.createElement(\'script\');' +
    '   tag.id = `' + config.name + 'Library`;' +
    '   tag.src = `' + apiUrl + '/bootstrap.js`;' +
    '   document.body.appendChild(tag);' +
    '  }' +
    ' })(\'' + config.name + '\', \'' + name + '\', ' + JSON.stringify(_props) + ', {});' +
    '</script>');
};

export default embedComponent;
