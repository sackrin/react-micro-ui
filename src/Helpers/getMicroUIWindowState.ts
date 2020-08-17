import { Subject } from 'rxjs';

type GetMicroUIWindowState = (defaultState: any, windowName: string) => any;

const getMicroUIWindowState: GetMicroUIWindowState = (defaultState, windowName) => {
  window[windowName] = new Subject();
  window[windowName].next(defaultState);
  return window[windowName];
};

export default getMicroUIWindowState;
