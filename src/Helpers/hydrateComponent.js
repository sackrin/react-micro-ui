import React from "react";
import { hydrate } from "react-dom";

const hydrateComponent = (Components) => (containerEl, name, props) => {
  const Comp = Components[name];
  hydrate(<Comp {...props} />, containerEl);
};

export default hydrateComponent;
