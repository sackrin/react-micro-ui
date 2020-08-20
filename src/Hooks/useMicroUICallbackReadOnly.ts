import { useState } from 'react';
import getMicroUIWindowName from '../Helpers/getMicroUIWindowName';
import getMicroUIWindowState from '../Helpers/getMicroUIWindowState';

type UseMicroUICallbackReadOnly = (
  path: string,
  prefix?: string,
) => (...args: any[]) => any;

const useMicroUICallbackReadOnly: UseMicroUICallbackReadOnly = (path, prefix = 'MICROUI') => {
  const [cb, setCb] = useState(() => () => {});
  const windowName = getMicroUIWindowName('CALLBACK', path, prefix);
  const windowStash = window[windowName] || getMicroUIWindowState(cb, windowName);
  windowStash.subscribe((_cb: (...args: any[]) => any) => {
    setCb(() => _cb);
  });
  return cb;
}

export default useMicroUICallbackReadOnly;
