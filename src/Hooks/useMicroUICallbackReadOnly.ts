import { useState } from 'react';
import getMicroUIWindowName from '../Helpers/getMicroUIWindowName';
import getMicroUIWindowState from '../Helpers/getMicroUIWindowState';

type UseMicroUICallbackReadOnly = (path: string, prefix?: string) => (...args: any[]) => any;

const useMicroUICallbackReadOnly: UseMicroUICallbackReadOnly = (path, prefix = 'MICROUI') => {
  const windowName = getMicroUIWindowName('CALLBACK', path, prefix);
  const windowStash = window[windowName] || getMicroUIWindowState(() => () => {}, windowName);
  const [cb, setCb] = useState<void | any>(undefined);
  windowStash.subscribe((_cb: (...args: any[]) => any) => {
    setCb(() => _cb);
  });
  return cb || windowStash.last;
};

export default useMicroUICallbackReadOnly;
