import React, { FunctionComponent } from 'react';
import type { Renderer} from 'react-dom';

type HydrateComponent = (
  hydrate: Renderer,
  components: {
    [key: string]: FunctionComponent;
  },
) => (containerEl: HTMLElement, name: string, props: any) => void;

const hydrateComponent: HydrateComponent = (hydrate, components) => (containerEl, name, props) => {
  const Comp = components[name];
  hydrate(<Comp {...props} />, containerEl);
};

export default hydrateComponent;
