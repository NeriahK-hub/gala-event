import React, { useEffect, useState } from 'react';
import { useContent } from '../../content/ContentContext';
import { AnimatedNumber, Reveal } from '../common/Reveal';

const DAY = 86_400_000;

export const CountdownSection: React.FC = () => {
  const { content, t } = useContent();
  const rawTarget = new Date(content.settings.salesDeadline).getTime();
  const target = Number.isNaN(rawTarget) ? new Date(content.galaInfo.isoDate).getTime() : rawTarget;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, target - now);
  const ended = target - now <= 0;
  const units = [
    { label: t('countdown.days'), value: Math.floor(diff / DAY) },
    { label: t('countdown.hours'), value: Math.floor((diff % DAY) / 3_600_000) },
    { label: t('countdown.minutes'), value: Math.floor((diff % 3_600_000) / 60_000) },
    { label: t('countdown.seconds'), value: Math.floor((diff % 60_000) / 1000) },
  ];

  return (
    <section className="relative py-20 sm:py-28 px-4" aria-label="Compte à rebours">
      <Reveal className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-[#FFB43A] mb-8 sm:mb-10">{ended ? t('countdown.endedTitle') : t('countdown.kicker')}</p>

        <div role="timer" className="grid grid-cols-4 divide-x divide-white/15">
          {units.map((unit) => (
            <div key={unit.label} className="px-1.5 sm:px-6">
              <AnimatedNumber
                value={String(unit.value).padStart(2, '0')}
                className="font-sans font-semibold tracking-tight text-white text-[2.6rem] leading-none sm:text-7xl md:text-8xl"
              />
              <p className="mt-3 text-xs sm:text-base text-white/60">{unit.label}</p>
            </div>
          ))}
        </div>

        {!ended && <p className="mt-10 sm:mt-12 text-base sm:text-lg text-white/80 max-w-md mx-auto text-balance">{t('countdown.note')}</p>}
      </Reveal>
    </section>
  );
};
