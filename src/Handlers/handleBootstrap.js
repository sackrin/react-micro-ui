import fs from 'fs';
import path from 'path';

const handleBootstrap = (profile, env, { name, assets, api, manifest, environments }) => async () => {
  // Retrieve the manifest file contents
  let manifestData = fs.readFileSync(manifest.filepath, 'utf8');
  // Determine the correct api and asset values based on
  const apiUrl = env.api?.url ? env.api?.url : api.url;
  const apiPath = env.api?.path ? env.api?.path : api.path;
  const assetUrl = env.assets?.url ? env.assets?.url : apiUrl;
  const assetTarget = env.assets?.target ? env.assets?.target : assets.target;
  // Replace the bootstrap JS placeholder tokens with permitted environment variables
  // This will be used by bootstrap and communicated within the window space to the built micro UI assets
  let contents = fs.readFileSync(path.join(__dirname, '../../assets', 'bootstrap.js'), 'utf8');
  contents = contents.replace(/__MANIFEST__/g, manifestData);
  contents = contents.replace(
    /__ENV__/g,
    JSON.stringify({
      name: name,
      apiUrl,
      apiPath,
      assetUrl: assetUrl || apiUrl,
      assetTarget,
      assetEntry: manifest.entry || 'main.js',
      profile: env,
    }),
  );
  // WARNING! Try everything we can to make sure the assets are NOT cached
  // This is the worst file to have cached, ensure this file does not cache
  return {
    headers: {
      'content-type': 'application/javascript',
      expires: '-1',
      'cache-control': 'private, no-cache, no-store, must-revalidate',
      pragma: 'no-cache',
    },
    contentType: 'text',
    body: contents,
    status: 200,
  };
};

export default handleBootstrap;
