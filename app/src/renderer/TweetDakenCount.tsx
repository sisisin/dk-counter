import React from 'react';
import { useClient, useDispatcher } from './App';

const formatter = new Intl.DateTimeFormat('ja-JP', {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: 'Asia/Tokyo',
});

function formatDakenTime(from: Date, to: Date) {
  return `${formatter.format(from)} - ${formatter.format(to)}`;
}
function formatForInput(d: Date) {
  const shift = d.getTime() + 9 * 60 * 60 * 1000;
  return new Date(shift).toISOString().split('.')[0];
}
function getDefaultPeriod() {
  const n = new Date();
  const startOfToday = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const endOfToday = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  endOfToday.setDate(endOfToday.getDate() + 1);
  endOfToday.setMinutes(endOfToday.getMinutes() - 1);
  return { from: startOfToday, to: endOfToday };
}

export const TweetDakenCount: React.FC<{ dakenCountTemplate: string }> = ({ dakenCountTemplate }) => {
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const dispatcher = useDispatcher();
  const client = useClient();
  const [dakenCount, setDakenCount] = React.useState(null);
  const [tweetText, setTweetText] = React.useState(null);
  const defaultPeriod = getDefaultPeriod();
  const [from, setFrom] = React.useState(defaultPeriod.from);
  const [to, setTo] = React.useState(defaultPeriod.to);

  React.useEffect(() => {
    if (dakenCount) {
      const template = textRef.current.value;
      const replaced = template
        .replace('%daken_count%', dakenCount.noteCount)
        .replace('%daken_time%', formatDakenTime(from, to));
      setTweetText(replaced);
    }
  }, [dakenCount]);

  const fetchDakenCount = async () => {
    dispatcher.tweetTemplateSaveRequested(textRef.current.value);
    const res = await client.getDakenCountBy({ from, to });
    setDakenCount(res);
  };

  return (
    <div>
      <hr></hr>

      <div>
        打鍵タイム
        <div>
          開始:{' '}
          <input
            onChange={(e) => setFrom(new Date(e.target.value))}
            value={formatForInput(from)}
            type="datetime-local"
            name="from"
          ></input>
        </div>
        <div>
          終了:{' '}
          <input
            onChange={(e) => setTo(new Date(e.target.value))}
            value={formatForInput(to)}
            type="datetime-local"
            name="to"
          ></input>
        </div>
        <div>daken_time: {formatDakenTime(from, to)}</div>
      </div>
      <hr></hr>
      <div>
        <div>ツイートテンプレート（打鍵カウントを得るとテンプレートが保存されます）</div>
        <textarea style={{ width: '400px', height: '4em' }} ref={textRef} defaultValue={dakenCountTemplate}></textarea>
      </div>
      <div>
        <button onClick={fetchDakenCount}>打鍵カウントを得る</button>
      </div>
      {tweetText && (
        <div>
          ツイートプレビュー
          <pre style={{ border: '1px solid black' }}>{tweetText}</pre>
          {dakenCount.noteCount ? (
            <button onClick={() => dispatcher.sendTweetClicked(tweetText)}>打鍵カウントをつぶやく</button>
          ) : (
            <button disabled>打鍵しろ</button>
          )}
        </div>
      )}
    </div>
  );
};
