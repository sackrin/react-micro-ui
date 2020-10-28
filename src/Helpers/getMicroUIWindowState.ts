import { Subject } from 'rxjs';

type GetMicroUIWindowState = (defaultState: any, windowName: string) => any;

const getMicroUIWindowState: GetMicroUIWindowState = (defaultState, windowName) => {
  const observable = new Subject();
  window[windowName] = {
    last: defaultState,
    observable: observable,
    subscribe: (subscriber: any) => observable.subscribe(subscriber),
    next: (state: any) => {
      window[windowName].last = state;
      window[windowName].observable.next(state);
    },
  };
  observable.next(defaultState);
  return window[windowName];
};

export default getMicroUIWindowState;
