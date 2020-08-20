import { useReducer } from 'react';
import getMicroUIWindowName from '../Helpers/getMicroUIWindowName';
import getMicroUIWindowState from '../Helpers/getMicroUIWindowState';

type UseMicroUIReducerReadOnly = <R extends React.Reducer<any, any>, I>(
  reducer: R,
  defaultState: I & React.ReducerState<R>,
  path: string,
  prefix?: string,
) => [any];

const useMicroUIReducerReadOnly: UseMicroUIReducerReadOnly = (reducer, defaultState, path, prefix = 'MICROUI') => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const windowName = getMicroUIWindowName('REDUCER', path, prefix);
  const windowStash = window[windowName] || getMicroUIWindowState(state, windowName);
  windowStash.subscribe((action: any) => {
    dispatch(action);
  });
  return [state];
};

export default useMicroUIReducerReadOnly;
