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
  seats: { transportType: 'bus', rows: 10, cols: 4, assignments: {} }, // assignments: { 'row-col': 'name' }
  room: { roomNumber: '', capacity: 4, members: [] },
  memo: '',
  pocketMoney: { budget: 5000, expenses: [] }, // expenses: { id, item, cost }
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
  ]
};

export function ShioriProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('shioriData');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('shioriData', JSON.stringify(data));
  }, [data]);

  const updateSection = (section, newValue) => {
    setData(prev => ({ ...prev, [section]: newValue }));
  };

  const resetData = () => {
    if (window.confirm('すべてのデータをリセットしてもよろしいですか？')) {
      setData(defaultState);
    }
  };

  return (
    <ShioriContext.Provider value={{ data, updateSection, resetData }}>
      {children}
    </ShioriContext.Provider>
  );
}
