import React from 'react';

const childComponent = components => (name, props) => {
  const Comp = components[name];
  return Comp && <Comp {...props} />;
};

export default childComponent;
