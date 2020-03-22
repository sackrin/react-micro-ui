import React from "react";

const renderComponent = (render, components) => (containerEl, name, props) => {
  const Comp = components[name];
  render(<Comp {...props} />, containerEl);
};

export default renderComponent;
