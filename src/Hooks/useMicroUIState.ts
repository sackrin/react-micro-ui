import { useState, useEffect, SetStateAction } from 'react';
import getMicroUIWindowName from '../Helpers/getMicroUIWindowName';
import getMicroUIWindowState from '../Helpers/getMicroUIWindowState';

type UseMicroUIState = <S>(defaultState: S, path: string, prefix?: string) => [S, React.Dispatch<SetStateAction<S>>];

const useMicroUIState: UseMicroUIState = (defaultState, path, prefix = 'MICROUI') => {
  const [state, setState] = useState(defaultState);
  const windowName = getMicroUIWindowName('STATE', path, prefix);
  const windowStash = window[windowName] || getMicroUIWindowState(state, windowName);
  windowStash.subscribe((value: any) => {
    setState(value);
  });
  useEffect(() => {
    windowStash.next(state);
  }, [windowStash, state]);
  return [state, setState];
};

export default useMicroUIState;
