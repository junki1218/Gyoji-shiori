// 活動名・持ち物名のキーワードから絵文字ピクトグラムを自動提案する
// PDF提案「ピクトグラムと生成AIを活用した校務DXの連携」の簡易版（キーワード辞書によるオフライン実装）
const KEYWORD_MAP = [
  { keywords: ['集合', 'あつまる'], emoji: '📍' },
  { keywords: ['出発', 'しゅっぱつ'], emoji: '🚶' },
  { keywords: ['到着', 'とうちゃく'], emoji: '🏁' },
  { keywords: ['バス', 'ばす'], emoji: '🚌' },
  { keywords: ['電車', 'でんしゃ', '新幹線'], emoji: '🚃' },
  { keywords: ['飛行機', 'ひこうき'], emoji: '✈️' },
  { keywords: ['ご飯', 'ごはん', '食事', '昼食', '夕食', '朝食', 'ランチ', '弁当'], emoji: '🍚' },
  { keywords: ['おやつ', 'お菓子'], emoji: '🍪' },
  { keywords: ['見学', 'けんがく'], emoji: '🏯' },
  { keywords: ['自由行動', 'じゆう'], emoji: '🎒' },
  { keywords: ['入浴', 'お風呂', 'ふろ'], emoji: '🛁' },
  { keywords: ['就寝', '消灯', 'ねる', '寝る'], emoji: '😴' },
  { keywords: ['起床', 'おきる', '起きる'], emoji: '⏰' },
  { keywords: ['着替え', 'きがえ'], emoji: '👕' },
  { keywords: ['トイレ'], emoji: '🚻' },
  { keywords: ['体験', 'たいけん'], emoji: '🙌' },
  { keywords: ['買い物', 'おかいもの', 'お土産', 'おみやげ'], emoji: '🛍️' },
  { keywords: ['写真', 'しゃしん'], emoji: '📷' },
  { keywords: ['移動', 'いどう'], emoji: '🚏' },
  { keywords: ['休憩', 'きゅうけい'], emoji: '☕' },
  { keywords: ['学校', 'がっこう'], emoji: '🏫' },
  { keywords: ['宿', 'ホテル', 'ほてる', '旅館'], emoji: '🏨' },
  { keywords: ['薬', 'くすり'], emoji: '💊' },
  { keywords: ['雨具', 'かさ', '傘'], emoji: '☂️' },
  { keywords: ['水泳', 'すいえい', 'プール'], emoji: '🏊' },
  { keywords: ['工作', 'こうさく'], emoji: '✂️' },
  { keywords: ['洗面用具', 'せんめん', 'タオル'], emoji: '🧴' },
  { keywords: ['筆記用具', 'ひっき', 'ノート'], emoji: '✏️' },
  { keywords: ['帽子', 'ぼうし'], emoji: '🧢' },
  { keywords: ['靴', 'くつ'], emoji: '👟' },
  { keywords: ['財布', 'さいふ', 'お金', 'おかね'], emoji: '👛' },
  { keywords: ['ハンカチ'], emoji: '🧻' },
  { keywords: ['マスク'], emoji: '😷' },
  { keywords: ['水筒', 'すいとう'], emoji: '🧃' },
];

export function suggestPictogram(text) {
  if (!text) return '';
  const found = KEYWORD_MAP.find(({ keywords }) =>
    keywords.some(k => text.includes(k))
  );
  return found ? found.emoji : '';
}
