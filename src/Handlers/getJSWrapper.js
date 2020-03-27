const getJSWrapper = (name, env, config, props, el) => {
  // Allow for env overrides
  const apiUrl = env.api?.url ? env.api?.url : config.api.url;
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
    '  if (w[\'exampleMicroUI\']) { m(); } else { w.addEventListener(\'microUILoaded\', m); }' +
    '  var d = document.getElementById(`' + config.name + 'Library`);' +
    '  if (d === null || d.length === 0) {' +
    '   var tag = document.createElement(\'script\');' +
    '   tag.id = `' + config.name + 'Library`;' +
    '   tag.src = `' + apiUrl + '/bootstrap.js`;' +
    '   document.body.appendChild(tag);' +
    '  }' +
    ' })(\'' + config.name + '\', \'' + name + '\', ' + JSON.stringify(props) + ', {});' +
    '</script>');
};

export default getJSWrapper;
