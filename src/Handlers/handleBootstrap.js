import fs from 'fs';
import path from 'path';

const handleBootstrap = ({ name, assets, api, manifest, environments }) => async (req, res) => {
  // Retrieve the manifest file contents
  let manifestData = fs.readFileSync(manifest.filepath, 'utf8');
  // Replace the bootstrap JS placeholder tokens with permitted environment variables
  // This will be used by bootstrap and communicated within the window space to the built micro UI assets
  let contents = fs.readFileSync(path.join(__dirname, '../../assets', 'bootstrap.js'), 'utf8');
  contents = contents.replace(/__MANIFEST__/g, manifestData);
  contents = contents.replace(
    /__ENV__/g,
    JSON.stringify({
      name: name,
      apiUrl: api.url,
      apiPath: api.path,
      assetUrl: assets.url || api.url,
      assetTarget: assets.target,
      assetEntry: manifest.entry || 'main.js',
    }),
  );
  // WARNING! Try everything we can to make sure the assets are NOT cached
  // This is the worst file to have cached, ensure this file does not cache
  res.setHeader('content-type', 'application/javascript');
  res.setHeader('expires', '-1');
  res.setHeader('cache-control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('pragma', 'no-cache');
  res.send(contents);
};

export default handleBootstrap;
