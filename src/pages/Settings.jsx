import React, { useRef, useState } from 'react';
import { useShiori } from '../context/ShioriContext';
import { Volume2, VolumeX, Type, Music, Upload, Download, FileJson } from 'lucide-react';
import { t } from '../utils/i18n';

export default function Settings() {
  const { data, updateSettings, importData, bgmUrl, setBgmUrl } = useShiori();
  const settings = data.settings;
  const { useKanji } = settings;
  const fileInputRef = useRef(null);
  const importInputRef = useRef(null);
  const [importError, setImportError] = useState('');

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgmUrl(url);
      updateSettings({ bgmFileName: file.name, bgmEnabled: true });
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `shiori-data-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        importData(parsed);
      } catch {
        setImportError(t(useKanji, 'ファイルの読み込みに失敗しました。正しいJSONファイルを選んでください。', 'ふぁいるの よみこみに しっぱいしました。ただしい JSON ふぁいるを えらんでください。'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '設定', 'せってい')}</h1>
        <p className="text-muted">{t(useKanji, 'アプリの表示や音に関する設定を変更できます。', 'あぷりの ひょうじや おとに かんする せっていを へんこうできます。')}</p>
      </div>

      <div className="flex-col gap-4">
        {/* 漢字設定 */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <Type size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{t(useKanji, '漢字の使用', 'かんじの しよう')}</h3>
              <p className="text-sm text-muted">{t(useKanji, 'ONにすると漢字を表示し、OFFにするとひらがなを優先します。', 'ON にすると かんじを ひょうじし、OFF にすると ひらがなを ゆうせんします。')}</p>
            </div>
          </div>
          <button
            className={`btn ${settings.useKanji ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleToggle('useKanji')}
          >
            {settings.useKanji ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* BGM設定 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <Music size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{t(useKanji, 'BGM（背景音楽）', 'BGM（はいけいおんがく）')}</h3>
                <p className="text-sm text-muted">{t(useKanji, 'アプリ実行中に音楽を流します。', 'あぷり じっこうちゅうに おんがくを ながします。')}</p>
              </div>
            </div>
            <button
              className={`btn ${settings.bgmEnabled ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleToggle('bgmEnabled')}
              disabled={!bgmUrl}
            >
              {settings.bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded" style={{ background: 'var(--background)', borderStyle: 'dashed' }}>
            <button className="btn btn-secondary" onClick={() => fileInputRef.current.click()}>
              <Upload size={18} /> {t(useKanji, 'ファイルを選択', 'ふぁいるを せんたく')}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              style={{ display: 'none' }}
            />
            <span className="text-sm text-muted">
              {settings.bgmFileName || t(useKanji, '音楽ファイルが選択されていません', 'おんがくふぁいるが せんたくされていません')}
            </span>
          </div>
        </div>

        {/* 効果音設定 */}
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
              {settings.seEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{t(useKanji, '効果音（SE）', 'こうかおん（SE）')}</h3>
              <p className="text-sm text-muted">{t(useKanji, 'ボタン操作などの音を鳴らします。', 'ぼたん そうさなどの おとを ならします。')}</p>
            </div>
          </div>
          <button
            className={`btn ${settings.seEnabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => handleToggle('seEnabled')}
          >
            {settings.seEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* データのエクスポート/インポート */}
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
              <FileJson size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{t(useKanji, 'データの保存・読み込み', 'でーたの ほぞん・よみこみ')}</h3>
              <p className="text-sm text-muted">{t(useKanji, 'しおりの内容をファイルに書き出したり、別の端末で読み込んだりできます。', 'しおりの ないようを ふぁいるに かきだしたり、べつの たんまつで よみこんだりできます。')}</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <button className="btn btn-secondary" onClick={handleExport}>
              <Download size={18} /> {t(useKanji, 'JSONで書き出す', 'JSON で かきだす')}
            </button>
            <button className="btn btn-secondary" onClick={() => importInputRef.current.click()}>
              <Upload size={18} /> {t(useKanji, 'JSONを読み込む', 'JSON を よみこむ')}
            </button>
            <input
              type="file"
              ref={importInputRef}
              onChange={handleImportChange}
              accept="application/json"
              style={{ display: 'none' }}
            />
          </div>
          {importError && (
            <p className="text-sm mt-2" style={{ color: '#ff6b6b' }}>{importError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
