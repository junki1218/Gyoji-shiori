import React, { createContext, useContext, useState, useEffect } from 'react';

const ShioriContext = createContext();

export function useShiori() {
  return useContext(ShioriContext);
}

const defaultState = {
  dateTime: { title: '修学旅行', startDate: '', endDate: '', meetingTime: '', meetingPlace: '' },
  destination: { name: '', address: '', description: '', mapUrl: '' },
  goals: { classGoal: '', personalGoal: '' },
  belongings: [
    { id: '1', name: '着替え', isEssential: true },
    { id: '2', name: '洗面用具', isEssential: true },
    { id: '3', name: '筆記用具', isEssential: true },
    { id: '4', name: '常備薬', isEssential: true },
  ],
  schedule: [
    { id: '1', date: '', time: '08:00', activity: '学校集合' }
  ],
  seats: { transportType: 'bus', rows: 10, cols: 4, assignments: {} },
  room: { roomNumber: '', capacity: 4, members: [] },
  memo: '',
  pocketMoney: { budget: 5000, expenses: [] },
  roles: [
    { id: '1', roleName: '班長', personName: '' },
    { id: '2', roleName: '保健係', personName: '' },
    { id: '3', roleName: '美化係', personName: '' }
  ],
  customPages: [
    { id: 11, title: 'フリーページ 1', content: '' },
    { id: 12, title: 'フリーページ 2', content: '' },
    { id: 13, title: 'フリーページ 3', content: '' },
    { id: 14, title: 'フリーページ 4', content: '' },
    { id: 15, title: 'フリーページ 5', content: '' },
  ],
  settings: {
    useKanji: true,
    bgmEnabled: false,
    seEnabled: true,
    bgmFileName: ''
  }
};

export function ShioriProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('shioriData');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed, settings: { ...defaultState.settings, ...parsed.settings } };
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    return defaultState;
  });

  const [bgmUrl, setBgmUrl] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('shioriData', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }, [data]);

  const updateSection = (section, newValue) => {
    setData(prev => ({ ...prev, [section]: newValue }));
  };

  const updateSettings = (newSettings) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  const resetData = () => {
    if (window.confirm('すべてのデータをリセットしてもよろしいですか？')) {
      setData(defaultState);
      setBgmUrl(null);
    }
  };

  return (
    <ShioriContext.Provider value={{ data, updateSection, updateSettings, resetData, bgmUrl, setBgmUrl }}>
      {children}
    </ShioriContext.Provider>
  );
}
