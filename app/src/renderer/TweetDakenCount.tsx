import React from 'react';

export const TweetDakenCount: React.FC = () => {
  return (
    <div>
      <button onClick={() => appEvents.sendTweetClicked()}>打鍵カウントをつぶやく</button>
    </div>
  );
};
