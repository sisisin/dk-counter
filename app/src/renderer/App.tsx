import React from 'react';
import { Settings } from './Settings';
import { TweetDakenCount } from './TweetDakenCount';

class Dispatcher {
  constructor(private store: { dispatch: (eventType: string, ...args) => void }) {}
  sendTwitterAnchorClicked() {
    this.store.dispatch('clickTwitterAnchor');
  }
  sendAuthorizeTwitterClicked(pin) {
    this.store.dispatch('authorizeTwitter', pin);
  }
  sendScoreDBPath(path) {
    this.store.dispatch('foo', path);
  }
  sendTweetClicked() {
    this.store.dispatch('tweet');
  }
}

const DispatcherContext = React.createContext<Dispatcher>(null);
export function useDispatcher() {
  return React.useContext(DispatcherContext);
}
function useMainState() {
  const [state, setState] = React.useState<AppState>({ twitter: {}, oraja: {} });

  React.useEffect(() => {
    const unsubscribe = appEvents.store.subscribe((state) => {
      setState(state);
    });
    appEvents.store.getState().then((state) => setState(state));

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
export type AppState = {
  twitter: { token?: string; secret?: string };
  oraja: {
    scoredbPath?: string;
  };
};
export const App: React.FC = () => {
  const state = useMainState();
  return (
    <DispatcherContext.Provider value={new Dispatcher(appEvents.store)}>
      <div>
        <Settings state={state}></Settings>
        <TweetDakenCount></TweetDakenCount>
      </div>
    </DispatcherContext.Provider>
  );
};