import React from 'react';

export const App: React.FC = () => {
  const pinInputRef = React.useRef<HTMLInputElement>(null);
  const filenameInputRef = React.useRef<HTMLInputElement>(null);
  const scoreDBInputRef = React.useRef<HTMLInputElement>(null);
  const [authed, setAuthed] = React.useState(false);

  const handlePinSubmit = (e) => {
    const pin = pinInputRef.current.value;
    appEvents.sendAuthorizeTwitterClicked(pin);
  };

  const handleScoreDBSet = () => {
    const path = (scoreDBInputRef.current.files[0] as any)?.path;
    scoreDBInputRef.current.value = '';

    if (path) {
      appEvents.sendScoreDBPath(path);
      filenameInputRef.current.value = path;
    }
  };

  const handleScoreDBSelect = () => {
    scoreDBInputRef.current.click();
  };

  React.useEffect(() => {
    (async () => {
      const { oraja, twitter } = await appEvents.store.getState();
      if (twitter.token && twitter.secret) {
        setAuthed(true);
      }
      if (oraja.scoredbPath) {
        filenameInputRef.current.value = oraja.scoredbPath;
      }
    })();
  }, []);
  return (
    <div>
      {!authed && (
        <div>
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                appEvents.sendTwitterAnchorClicked();
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
      <input type="text" disabled ref={filenameInputRef} style={{ width: '600px' }}></input>
      <input
        type="file"
        id="fileElem"
        name="scoredb"
        style={{ display: 'none' }}
        ref={scoreDBInputRef}
        onChange={handleScoreDBSet}
      />
      <button onClick={handleScoreDBSelect}>選択</button>
      <div>
        <button onClick={() => appEvents.sendTweetClicked()}>tweet</button>
      </div>
    </div>
  );
};
