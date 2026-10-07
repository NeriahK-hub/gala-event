import React, { useState, useEffect } from 'react';
import { useContent } from '../../content/ContentContext';
import { Clock } from 'lucide-react';

export const CountdownSection: React.FC = () => {
  const { content, t } = useContent();
  const targetDate = new Date(content.galaInfo.isoDate).getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: t('countdown.days'), value: timeLeft.days },
    { label: t('countdown.hours'), value: timeLeft.hours },
    { label: t('countdown.minutes'), value: timeLeft.minutes },
    { label: t('countdown.seconds'), value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-12 px-4 border-y border-[#D4A857]/20 bg-[#3D0309]/40 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#E8C98A] font-semibold mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('countdown.kicker')}</span>
        </div>

        {/* 4 Large Golden Digit Units */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {units.map((unit, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 rounded-xl border border-[#D4A857]/30 bg-gradient-to-b from-[#7A0815]/50 to-[#3D0309]/80 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center relative group hover:border-[#D4A857]/60 transition-colors"
            >
              {/* Subtle top gold highlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-[#D4A857]/60" />

              <span className="font-serif tabular-nums text-4xl sm:text-5xl md:text-6xl text-gold-gradient tracking-tight">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase tracking-[0.12em] text-[#E8C98A] mt-2 font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </div>

        <p className="font-serif italic text-base text-[#F3E5AB] mt-6">
          {t('countdown.note')}
        </p>
      </div>
    </section>
  );
};
