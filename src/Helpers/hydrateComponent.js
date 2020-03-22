import React from "react";

const hydrateComponent = (hydrate, components) => (containerEl, name, props) => {
  const Comp = components[name];
  hydrate(<Comp {...props} />, containerEl);
};

export default hydrateComponent;
