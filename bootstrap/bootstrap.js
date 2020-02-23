import 'core-js/stable';
import 'regenerator-runtime/runtime';
import doLoadScript from './doLoadScript';
import getMicroUILoadedEvent from './getMicroUILoadedEvent';
import getMicroUIErrorEvent from './getMicroUIErrorEvent';

// Tokens to be replaced by the express endpoint
// PLEASE NOTE: the __???__ will be stripped out and replaced when express serves this file
// DO NOT USE THE TOKENS THEMSELVES! ie __ENV__.something, use the const so env.something
const env = __ENV__;
const manifest = __MANIFEST__;

/**
 * Fetches assets and emits an event to indicate the micro UI is ready to use
 * Loops through all of the JS assets within the generate manifest.json and loads them in
 * Once all assets are loaded a event will be emitted on the window object
 * PLEASE NOTE: Components wishing to use these assets should be listening for this event emit
 */
const fetchAssetsHandler = () => {
  // Set the env vars in the window space for easy access
  window[`__MicroUI${env.name}Environment__`] = env;
  // Set the webpack custom URL for asset retrieval
  window[`__MicroUI${env.name}URL__`] = env.apiUrl + '/';
  // Set the webpack custom URL for asset retrieval
  window[`__MicroUI${env.name}AssetURL__`] = env.assetUrl + '/';
  // Retrieve the main JS
  const entryUrl = manifest[env.assetEntry || 'main.js'];
  // Load the manifest assets
  // @QUESTION should we support multiple entry files?
  doLoadScript(`${env.assetUrl}${entryUrl}`)
    .catch(() => {
      window.dispatchEvent(getMicroUIErrorEvent(env));
    })
    .then(() => {
      window.dispatchEvent(getMicroUILoadedEvent(env));
    });
};
// If the document is ready or has DOM elements rendered
// This is for loading bootstrap.js outside of the <HEAD>
// PLEASE NOTE: Most SPA react applications will do this
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  fetchAssetsHandler();
} else {
  document.addEventListener('DOMContentLoaded', fetchAssetsHandler, false);
}
