import React from 'react';
import { useShiori } from '../context/ShioriContext';
import { t } from '../utils/i18n';

export default function Page3Goals() {
  const { data, updateSection } = useShiori();
  const { useKanji } = data.settings;
  const goals = data.goals;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSection('goals', { ...goals, [name]: value });
  };

  return (
    <div className="animation-fade-in">
      <div className="page-header">
        <h1>{t(useKanji, '3. 目標', '3. もくひょう')}</h1>
        <p className="text-muted">
          {t(useKanji, '行事全体のスローガンや個人の目標を設定しましょう。', 'ぎょうじぜんたいの すろーがんや こじんの もくひょうを せっていしましょう。')}
        </p>
      </div>

      <div className="card mb-4">
        <div className="form-group">
          <label>{t(useKanji, 'クラス・学年のスローガン', 'くらす・がくねんの すろーがん')}</label>
          <textarea 
            name="classGoal" 
            value={goals.classGoal} 
            onChange={handleChange} 
            rows="3"
            placeholder={t(useKanji, '例：ルールを守り、協力して最高の思い出を作ろう！', 'れい：るーるを まもり、きょうりょくして さいこうの おもいでを つくろう！')} 
          />
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>{t(useKanji, '個人の目標', 'こじんの もくひょう')}</label>
          <textarea 
            name="personalGoal" 
            value={goals.personalGoal} 
            onChange={handleChange} 
            rows="3"
            placeholder={t(useKanji, '例：班長として責任を持って行動する。', 'れい：はんちょうとして せきにんを もって こうどうする。')} 
          />
        </div>
      </div>
    </div>
  );
}
