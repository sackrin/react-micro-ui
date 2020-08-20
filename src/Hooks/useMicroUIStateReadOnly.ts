import { useState } from 'react';
import getMicroUIWindowName from '../Helpers/getMicroUIWindowName';
import getMicroUIWindowState from '../Helpers/getMicroUIWindowState';

type UseMicroUIStateReadOnly = <S>(defaultState: S, path: string, prefix?: string) => [S];

const useMicroUIStateReadOnly: UseMicroUIStateReadOnly = (defaultState, path, prefix = 'MICROUI') => {
  const [state, setState] = useState(defaultState);
  const windowName = getMicroUIWindowName('STATE', path, prefix);
  const windowStash = window[windowName] || getMicroUIWindowState(state, windowName);
  windowStash.subscribe((value: any) => {
    setState(value);
  });
  return [state];
};

export default useMicroUIStateReadOnly;
