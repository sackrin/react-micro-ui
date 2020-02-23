import React, { useState } from 'react';
import { useMicroUI } from '../Hooks';

export const MicroUIComponent = props => {
  // Deconstruct the micro UI component values
  const {
    microUi: { url, library, name },
  } = props;
  // We need to have a ref, this will be the component the micro UI's internal reactDomRender will render into
  const [ref, setRef] = useState(null);
  // Invoke the custom micro UI hook to retrieve the mounting callback and the loading state
  // It does not matter if we have several components attempting to load the same micro UI, it will only load the assets once
  const [render, loaded] = useMicroUI(url, library);
  // Once we have a ref and the micro ui reports as loaded then proceed to load in our component
  if (ref && loaded) {
    // Pass in our container ref, the name of the exported micro UI component we want to render and the props for that component
    render(ref, name, props);
  }
  // Return out a div to embed within
  // @TODO make this able to be passed in
  return <div ref={setRef} />;
};

export default MicroUIComponent;
