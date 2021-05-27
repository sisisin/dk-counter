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
  if (d.toString() === 'Invalid Date') {
    return '';
  }
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

function usePeriod() {
  const initialPeriod = getDefaultPeriod();
  const [pureFrom, setPureFrom] = React.useState(initialPeriod.from);
  const [pureTo, setPureTo] = React.useState(initialPeriod.to);

  const from = pureFrom.toString() === 'Invalid Date' ? initialPeriod.from : pureFrom;
  const to = pureTo.toString() === 'Invalid Date' ? initialPeriod.to : pureTo;

  return {
    data: {
      from,
      setFrom: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPureFrom(new Date(e.target.value));
      },
      to,
      setTo: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPureTo(new Date(e.target.value));
      },
    },
    view: { from: formatForInput(pureFrom), to: formatForInput(pureTo) },
    dakenTime: formatDakenTime(from, to),
  };
}

export const TweetDakenCount: React.FC<{ dakenCountTemplate: string }> = ({ dakenCountTemplate }) => {
  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const dispatcher = useDispatcher();
  const client = useClient();
  const [dakenCount, setDakenCount] = React.useState(null);
  const [tweetText, setTweetText] = React.useState(null);
  const { data, view, dakenTime } = usePeriod();

  const fetchDakenCount = async () => {
    dispatcher.tweetTemplateSaveRequested(textRef.current.value);
    const res = await client.getDakenCountBy({ from: data.from, to: data.to });
    setDakenCount(res);
    const template = textRef.current.value;
    const replaced = template.replace('%daken_count%', `${res.noteCount}`).replace('%daken_time%', dakenTime);
    setTweetText(replaced);
  };

  return (
    <div>
      <hr></hr>

      <div>
        打鍵タイム
        <div>
          開始: <input onChange={data.setFrom} value={view.from} type="datetime-local" name="from"></input>
        </div>
        <div>
          終了: <input onChange={data.setTo} value={view.to} type="datetime-local" name="to"></input>
        </div>
        <div>daken_time: {dakenTime}</div>
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
