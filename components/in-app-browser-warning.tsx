'use client';

import { useEffect, useState } from 'react';

export function InAppBrowserWarning() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Reguły dla popularnych in-app browserów (FB, Insta, TikTok, LinkedIn, itp.)
    const rules = [
      'FB_IAB', 'FB4A', 'FBAV', 'FBAN', // Facebook / Messenger
      'Instagram',                      // Instagram
      'TikTok',                         // TikTok
      'LinkedInApp',                    // LinkedIn
      'Snapchat',                       // Snapchat
      'Line',                           // LINE
    ];
    
    const isIab = rules.some(rule => ua.includes(rule));
    setIsInAppBrowser(isIab);

    if (/iPad|iPhone|iPod/.test(ua)) {
      setOs('ios');
    } else if (/android/i.test(ua)) {
      setOs('android');
    }
  }, []);

  if (!isInAppBrowser) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center p-6 bg-slate-900/98 backdrop-blur-md text-white">
      {/* IOS - menu na dole (Safari) lub na górze w FB, Android zazwyczaj góra prawo */}
      <div className="absolute top-4 right-6 animate-bounce text-blue-400 flex flex-col items-center">
        <svg className="w-10 h-10 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        <span className="text-sm font-semibold mt-1">Menu</span>
      </div>

      <div className="mt-24 bg-slate-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl border border-slate-700 text-center">
        <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Jebać wewnętrzne przeglądarki!</h2>
        <p className="text-slate-300 mb-6">
          Ta przeglądarka (Messenger/FB/IG) blokuje niektóre funkcje zapisów na rejs. Wejdź kurwa przez zwykłą.
        </p>
        
        <div className="bg-slate-900 p-5 rounded-xl text-left border border-slate-700">
          <p className="font-semibold text-white mb-3">Jak przejść do normalnej?</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-300 text-sm">
            <li>Znajdź ikonę <span className="font-bold text-white">3 kropek</span> (prawy górny róg)</li>
            <li>Kliknij <span className="font-bold text-white">Otwórz w {os === 'ios' ? 'Safari' : 'przeglądarce'}</span>, albo coś takiego</li>
          </ol>
        </div>
      </div>
      
      {/* Na wypadek, gdyby menu byo w prawym dolnym rogu na iOS w poszczególnych apkach */}
      {os === 'ios' && (
         <div className="absolute bottom-6 right-6 animate-bounce text-blue-400 flex flex-col items-center">
          <svg className="w-10 h-10 rotate-[135deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="text-sm font-semibold mt-1">Menu</span>
       </div>
      )}
    </div>
  );
}
