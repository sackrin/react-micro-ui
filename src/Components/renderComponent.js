import React from "react";
import { render } from "react-dom";

const renderComponent = (Components) => (containerEl, name, props) => {
  const Comp = Components[name];
  render(<Comp {...props} />, containerEl);
};

export default renderComponent;
