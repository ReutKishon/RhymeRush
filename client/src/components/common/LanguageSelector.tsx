import React, { useState, useRef, useEffect } from 'react';
import useAppStore from '../../store/useStore';

const USFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <g fillRule="evenodd">
      <g strokeWidth="1pt">
        <path fill="#bd3d44" d="M0 0h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8V197H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0z"/>
        <path fill="#fff" d="M0 39.4h972.8v39.4H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0z"/>
      </g>
      <path fill="#192f5d" d="M0 0h389.1v275.7H0z"/>
      <path fill="#fff" d="M32.4 11.8L36 22.7h11.4l-9.2 6.7 3.5 11-9.3-6.8-9.2 6.7 3.5-10.9-9.3-6.7H29z"/>
    </g>
  </svg>
);

const IsraelFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <defs>
      <clipPath id="il-a">
        <path fillOpacity=".7" d="M-87.6 0H595v512H-87.6z"/>
      </clipPath>
    </defs>
    <g fillRule="evenodd" clipPath="url(#il-a)" transform="translate(82.1) scale(.94)">
      <path fill="#fff" d="M619.4 512H-112V0h731.4z"/>
      <path fill="#00c" d="M619.4 115.2H-112V48h731.4zm0 350.5H-112v-67.2h731.4zm-483-275l110.1 191.6L359 191.6l-222.6-.8z"/>
      <path fill="#00c" d="M225.8 317.8L136 295.5l89.8-22.3-55.5-74.4 91.2 21.4-55.5-74.4L316 218.2l89.8-22.3-55.5 74.4 91.2-21.4-55.5 74.4z"/>
    </g>
  </svg>
);

const languages = {
  en: {
    name: 'English',
    flag: USFlag,
    code: 'EN'
  },
  he: {
    name: 'עברית',
    flag: IsraelFlag,
    code: 'עב'
  }
};

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const currentLang = languages[language];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Flag = currentLang.flag;

  return (
    <div className="fixed top-4 left-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md hover:bg-gray-50"
        >
          <Flag />
          <span className="text-black text-sm font-medium">{currentLang.code}</span>
          <span className="text-gray-500">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {Object.entries(languages).map(([code, lang]) => {
              const LangFlag = lang.flag;
              return (
                <div
                className={`w-full cursor-pointer rounded-lg flex items-center gap-2 px-3 py-2 hover:bg-gray-50 ${
                    language === code ? 'bg-gray-100 font-medium' : ''
                  }`} 
                  key={code}
                  onClick={() => {
                    setLanguage(code as 'en' | 'he');
                    document.documentElement.dir = code === 'he' ? 'rtl' : 'ltr';
                    document.documentElement.lang = code;
                    setIsOpen(false);
                  }}
                  
                >
                  <LangFlag />
                  <span className="text-sm">{lang.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;