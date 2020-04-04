import React, { FunctionComponent } from 'react';

type ChildComponent = (components: {
  [key: string]: FunctionComponent;
}) => (name: string, props: any) => React.ReactNode;

const childComponent: ChildComponent = components => (name, props) => {
  const Comp = components[name];
  return Comp ? <Comp {...props} /> : <React.Fragment />;
};

export default childComponent;
