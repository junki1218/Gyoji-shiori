# しおりメーカー 改善ログ

## 改善サイクルの方針
① バグ発見・改善案提示 → ② 修正プランを本ファイルに記録 → ③ 実装 → ④ 記録追記 → ⑤ デバッグ → ① に戻る

---

## サイクル 1（2026-06-30）

### 発見したバグ・問題点

| No. | 重要度 | 場所 | 問題 |
|-----|--------|------|------|
| B-01 | 🔴 致命的 | `PageCustom.jsx` | フリーページに `content` フィールドを入力するUIが存在しない。Preview/Print は `p.content` でフィルタリングするため、フリーページがしおりに一切出力されない |
| B-02 | 🟠 高 | `ShioriContext.jsx` | localStorage からの復元時に `pocketMoney` が浅いマージのみ。将来フィールド追加時にデフォルト値が適用されない |
| B-03 | 🟡 中 | `Page4_Belongings.jsx`, `Page7_Room.jsx`, `Page9_PocketMoney.jsx` | `onKeyPress` は React 17以降で非推奨。`onKeyDown` に変更が必要 |
| B-04 | 🟡 中 | `Page6_Seats.jsx` | 列数・行数を縮小しても範囲外のアサインメントが `assignments` オブジェクトに残留する |
| B-05 | 🟡 中 | `App.jsx` | サイドバーのアクティブリンクがスクロール外に出ても自動スクロールしない |
| B-06 | 🟢 低 | `PageCustom.jsx` | コメント削除・完了ボタンに `.btn` クラスが未付与でスタイルなし |

### 修正プラン

**B-01（致命的）**: `PageCustom.jsx` にテキストエリアを追加し、`content` フィールドを編集可能にする。画像エリアの下にテキスト入力欄を設置。

**B-02（高）**: `ShioriContext.jsx` の初期化部分で `pocketMoney` も明示的にマージする。

**B-03（中）**: 全該当箇所の `onKeyPress` を `onKeyDown` に変更し、`e.key === 'Enter'` でチェック。

**B-04（中）**: `Page6_Seats.jsx` の `handleDimensionChange` で変更後の行/列数に基づいて `assignments` から範囲外エントリを削除する。

**B-05（中）**: `App.jsx` の `Sidebar` で `useEffect` + `scrollIntoView` を使ってアクティブリンクを可視領域に自動スクロールする。

**B-06（低）**: コメント操作ボタンに `btn btn-icon` / `btn btn-primary` スタイルを付与する。

### UI 改善プラン

| No. | 対象 | 改善内容 |
|-----|------|---------|
| U-01 | `Page9_PocketMoney.jsx` | 予算消費プログレスバーを追加（残額の視覚的表示） |
| U-02 | `Page5_Schedule.jsx` | 同一日付のイベントをグループ化して表示する |
| U-03 | `App.jsx` | サイドバーのタイトルをクリックでトップページへ（ロゴリンク化） |
| U-04 | `index.css` | フォーカスリングをチョーク風に統一 |

---

### 実装記録

#### B-01 修正 ✅
- `PageCustom.jsx` に `content` テキストエリアを追加
- 画像エリアの有無にかかわらず content は常に編集可能
- Preview/Print との整合性が確保された

#### B-02 修正 ✅
- `ShioriContext.jsx` の初期化で `pocketMoney` を明示的にマージ
- `customPages` も `defaultState` の値で安全にマージ

#### B-03 修正 ✅
- `Page4_Belongings.jsx`, `Page7_Room.jsx`, `Page9_PocketMoney.jsx` の `onKeyPress` を `onKeyDown` に変更

#### B-04 修正 ✅
- `Page6_Seats.jsx` の次元変更時に範囲外アサインメントを自動削除

#### B-05 修正 ✅
- `App.jsx` の Sidebar で `useEffect` + `scrollIntoView` を実装

#### B-06 修正 ✅
- `PageCustom.jsx` のコメントボタンにスタイルを付与

#### U-01 実装 ✅
- `Page9_PocketMoney.jsx` に消費プログレスバーを追加

#### U-02 実装 ✅
- `Page5_Schedule.jsx` で同日グループ化表示

#### U-03 実装 ✅
- サイドバータイトルをリンク化

#### U-04 実装 ✅
- `index.css` のフォーカスリングをチョーク風に統一

---

## サイクル 2（次回以降）

### 予定している改善
- [ ] 座席表の視覚的プレビュー強化（バス・電車シルエット）
- [ ] スケジュールページのドラッグ&ドロップ並べ替え
- [ ] エクスポート機能（JSON形式でのデータ保存・読み込み）
- [ ] スマートフォン対応のレスポンシブ改善
