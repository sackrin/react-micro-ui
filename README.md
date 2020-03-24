## React Micro UI/Frontend

A quick ReactJS driven micro frontend framework

### Installation

This is a npm library available for installation via npm

```npm i -s @sackrin/react-micro-ui```

## Quick Usage

```js
import { hydrate, render } from "react-dom";
import ExampleComponent from './ExampleComponent';
import { renderComponent, hydrateComponent, childComponent } from '@sackrin/react-micro-ui/lib/Helpers';

export const Components = {
  ExampleComponent,
};

export const Helpers = {
  ExampleHelper: () => { console.log('Hello World!'); }
};

export const Hydrate = hydrateComponent(hydrate, Components);
export const Render = renderComponent(render, Components);
export const Child = childComponent(Components);
```
