import React from 'react';
import { AppState, useDispatcher } from './App';

type Props = {
  state: AppState;
};
export const Settings: React.FC<Props> = ({ state: { twitter, oraja } }) => {
  const pinInputRef = React.useRef<HTMLInputElement>(null);
  const scoreDBInputRef = React.useRef<HTMLInputElement>(null);
  const dispatcher = useDispatcher();

  const authorized = twitter.token && twitter.secret;
  const handlePinSubmit = (e) => {
    const pin = pinInputRef.current.value;
    dispatcher.sendAuthorizeTwitterClicked(pin);
  };

  const handleScoreDBSet = () => {
    const path = (scoreDBInputRef.current.files[0] as any)?.path;
    scoreDBInputRef.current.value = '';

    if (path) {
      dispatcher.sendScoreDBPath(path);
    }
  };

  return (
    <div>
      {!authorized && (
        <div>
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatcher.sendTwitterAnchorClicked();
              }}
            >
              authorize with twitter
            </a>
          </div>
          <div>twitter pin</div>
          <input name="twitter-pin" ref={pinInputRef} />
          <button id="pin-submit" onClick={handlePinSubmit}>
            submit
          </button>
        </div>
      )}
      score.db:
      <input type="text" disabled value={oraja.scoredbPath ?? ''} style={{ width: '600px' }}></input>
      <input
        type="file"
        id="fileElem"
        name="scoredb"
        style={{ display: 'none' }}
        ref={scoreDBInputRef}
        onChange={handleScoreDBSet}
      />
      <button onClick={() => scoreDBInputRef.current.click()}>選択</button>
    </div>
  );
};
