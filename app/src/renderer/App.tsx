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
  sendTweetClicked(message: string) {
    this.store.dispatch('tweet', message);
  }
  tweetTemplateSaveRequested(template: string) {
    this.store.dispatch('tweetTemplateSaveRequested', template);
  }
}

class Client {
  constructor(private fetch: <T>(eventType: string, ...args) => Promise<T>) {}

  getDakenCountBy({ from, to }: { from: Date; to: Date }) {
    return this.fetch('getDakenCountBy', { from, to });
  }
}
const ClientContext = React.createContext<Client>(null);
export function useClient() {
  return React.useContext(ClientContext);
}
const DispatcherContext = React.createContext<Dispatcher>(null);
export function useDispatcher() {
  return React.useContext(DispatcherContext);
}
function useMainState() {
  const [state, setState] = React.useState<AppState>({ twitter: {}, oraja: {}, dakenCountTemplate: '' });

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
  dakenCountTemplate: string;
};
export const App: React.FC = () => {
  const state = useMainState();
  return (
    <ClientContext.Provider value={new Client(appEvents.client.fetch)}>
      <DispatcherContext.Provider value={new Dispatcher(appEvents.store)}>
        <div>
          <Settings state={state}></Settings>
          <TweetDakenCount dakenCountTemplate={state.dakenCountTemplate}></TweetDakenCount>
        </div>
      </DispatcherContext.Provider>
    </ClientContext.Provider>
  );
};
