import { useState, useCallback, useEffect } from 'react';

/*
  useMicroUI Hook
  Use this hook to embed a micro UI component into a primary application
  the hook will handle both loading the library and returning the callbacks to render micro UI components
  @param baseUrl = the url to the micro UI ie http://examplemicroui.com
  @param libraryName = the UMD library name
 */
function useMicroUI(baseUrl, libraryName) {
  const [libraryLoaded, setLibraryLoaded] = useState(0);
  const [bootstrapLoaded, setBootstrapLoaded] = useState(false);
  const [bootstrapError, setBootstrapError] = useState(false);
  // Checks if the micro UI script is present
  const hasBootstrapScript = useCallback(() => {
    // We want to check for both the script and the window object
    // This is in case the script was included somewhere without the id we expect
    return !!document.getElementById(`${libraryName}Library`) || window[libraryName];
  }, [baseUrl, libraryName]);
  // Loads the micro UI script
  const addBootstrapScript = useCallback(() => {
    const tag = document.createElement('script');
    tag.id = `${libraryName}Library`;
    tag.src = `${baseUrl}/bootstrap.js`;
    tag.onload = () => setBootstrapLoaded(true);
    tag.onerror = e => setBootstrapError(true);
    document.getElementsByTagName('head')[0].appendChild(tag);
  }, [baseUrl, libraryName]);
  // Handle the micro UI emitting a loaded event
  const handleMicroUILoadEvent = useCallback(e => {
    // Since all micro UIs emit a microUILoaded custom event we need to check this is the one we are after
    if (e.detail.name === libraryName) {
      setLibraryLoaded(true);
    }
  }, []);
  // Use the micro UI's exported render helper to render the actual component
  const renderComponent = useCallback(
    (ref, name, props) => {
      if (window[libraryName] && window[libraryName].Render) {
        window[libraryName].Render(ref, name, props);
      }
    },
    [libraryLoaded],
  );
  // Listen for the MicroUI to emit that it has fully loaded
  // This has to happen in order to allow for the micro UI to load all assets within the manifest
  useEffect(() => {
    // If the library has already been detected as loaded and has environment vars
    if (window[libraryName] && window[`__MicroUI${libraryName}AssetURL__`]) {
      setLibraryLoaded(true);
    }
    // Setup the listener against the window event space AND return a cleanup event remover
    window.addEventListener('microUILoaded', handleMicroUILoadEvent);
    return () => {
      window.removeEventListener('microUILoaded', handleMicroUILoadEvent);
    };
  }, []);
  // If the library bootstrap has not been detected then we have to initiate the script loading
  // This is where the bootstrap.js is loaded and not the actual assets within manifest.js
  // Manifest.js assets are loaded within the bootstrap.js and a custom microUILoaded window event is emitted on completion
  if (!bootstrapLoaded && !bootstrapError && !hasBootstrapScript()) {
    addBootstrapScript();
  }
  // If the library is loaded then return the render helper, the various loaded flags and the library itself
  // Otherwise return all nulls and falses
  return libraryLoaded
    ? [renderComponent, libraryLoaded, setBootstrapLoaded, setBootstrapError, window[libraryName]]
    : [null, false, false, false, null];
}

export default useMicroUI;
