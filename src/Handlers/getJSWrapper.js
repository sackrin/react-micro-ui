const getJSWrapper = (name, config, props, el) => ('<div data-microui-library="' + config.name + '" data-microui-component="' + name + '">' +
  '' + el + '' +
  '<script type="application/javascript">' +
  ' if (!!document.getElementById(`' + config.name + 'Library`)) { ' +
  '   var tag = document.createElement(\'script\'); ' +
  '   tag.id = `' + config.name + 'Library`; ' +
  '   tag.src = `' + config.api.url + '/bootstrap.js`; ' +
  '   document.body.appendChild(tag); ' +
  ' } ' +
  ' (function(n, c, p, t) { ' +
  '   var w = window, m = function(e){ if (e.detail.library === n)' +
  '     w[n].default.hydrateComponent(document.querySelector(\`div[data-microui-component="' + name + '"] div[data-reactroot]\`),c,p,t); };' +
  '     if (w[n]) { m(); } else { w.addEventListener(\'microUILoaded\', m); }' +
  '   })(\'' + config.name + '\', \'' + name + '\', ' + JSON.stringify(props) + ', {});' +
  '</script>' +
  '</div>');

export default getJSWrapper;
