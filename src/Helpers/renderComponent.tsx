import React, { FunctionComponent } from 'react';
import type { Renderer } from 'react-dom';

type RenderComponent = (
  render: Renderer,
  components: {
    [key: string]: FunctionComponent;
  },
) => (containerEl: HTMLElement, name: string, props: any) => void;

const renderComponent: RenderComponent = (render, components) => (containerEl, name, props) => {
  const Comp = components[name];
  render(<Comp {...props} />, containerEl);
};

export default renderComponent;
