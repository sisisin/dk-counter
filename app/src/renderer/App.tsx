import React from 'react';

export const App: React.FC = () => {
  const pinInputRef = React.useRef<HTMLInputElement>(null);
  const scoreDBInputRef = React.useRef<HTMLInputElement>(null);

  const handlePinSubmit = (e) => {
    const pin = pinInputRef.current.value;
    appEvents.sendAuthorizeTwitterClicked(pin);
  };

  const handleScoreDBSet = () => {
    const path = (scoreDBInputRef.current.files[0] as any).path;

    appEvents.sendScoreDBPath(path);
  };
  return (
    <div>
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
      {/* <!-- todo: https://developer.mozilla.org/ja/docs/Web/API/File/Using_files_from_web_applications --> */}
      <input name="scoredb" type="file" ref={scoreDBInputRef} onChange={handleScoreDBSet} />

      <div>
        <button onClick={() => appEvents.sendTweetClicked()}>tweet</button>
      </div>
    </div>
  );
};
