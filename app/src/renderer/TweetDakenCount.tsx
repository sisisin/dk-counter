import React from 'react';
import { useClient, useDispatcher } from './App';

export const TweetDakenCount: React.FC = () => {
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const dispatcher = useDispatcher();
  const client = useClient();
  const [dakenCount, setDakenCount] = React.useState(null);
  const [tweetText, setTweetText] = React.useState(null);

  React.useEffect(() => {
    if (dakenCount) {
      const template = textRef.current.value;
      const replaced = template
        .replace('%daken_count%', dakenCount.noteCount)
        .replace('%daken_time%', dakenCount.dakenDate);
      setTweetText(replaced);
    }
  }, [dakenCount]);

  return (
    <div>
      <button
        onClick={async () => {
          const n = new Date();
          const startOfToday = new Date(n.getFullYear(), n.getMonth(), n.getDate());
          const endOfToday = new Date(n.getFullYear(), n.getMonth(), n.getDate());
          endOfToday.setDate(endOfToday.getDate() + 1);
          const res = await client.getDakenCountBy({ from: startOfToday, to: endOfToday });
          setDakenCount(res);
        }}
      >
        打鍵カウントを得る
      </button>
      <div>
        <textarea style={{ width: '400px', height: '4em' }} ref={textRef}>
          %daken_time%は%daken_count%ノーツ叩いた
        </textarea>
      </div>
      {tweetText && (
        <div>
          ツイートプレビュー
          <pre style={{ border: '1px solid black' }}>{tweetText}</pre>
          <button onClick={() => dispatcher.sendTweetClicked(tweetText)}>打鍵カウントをつぶやく</button>
        </div>
      )}
    </div>
  );
};
