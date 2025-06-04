import { useState } from 'react';
import styles from '../../styles/Prestige.module.scss';
import { calculateRobocoins, calculateNewBonus } from '../../utils/prestigeUtils';
import { FaMedal } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function PrestigeButton({ gameState, setGameState }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const prestigeData = gameState?.prestige;

  if (!prestigeData || typeof prestigeData !== 'object') {
    return <div style={{ color: 'red' }}>⚠️ Престиж не завантажено</div>;
  }

  const earned = gameState.credits || 0;
  const robocoinsOnReset = calculateRobocoins(earned);
  const newTotal = +(prestigeData.robocoins + robocoinsOnReset).toFixed(2);
  const newBonus = calculateNewBonus(newTotal);

  const handlePrestige = () => {
    if (robocoinsOnReset < 0.01) return;

    setGameState({
      credits: 0,
      clickValue: 1,
      upgrades: { click: 0, auto: 0, crit: 0, passive: 0 },
      caseStats: { basic: 0, rare: 0, epic: 0, skin: 0 },
      skins: { unlocked: [], active: null },
      prestige: {
        robocoins: newTotal,
        bonusPercent: newBonus
      },
      stats: {
        totalClicks: 0,
        totalCreditsEarned: 0,
        totalCasesOpened: 0,
        totalUpgrades: 0,
      }
    });
  };

  return (
    <div className={styles.prestigeBox}>
      <div
        className={styles.prestigeHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaMedal className={styles.icon} />
        <span className={styles.title}>ПРЕСТИЖ</span>
        {isExpanded ? <FiChevronUp className={styles.chevron} /> : <FiChevronDown className={styles.chevron} />}
      </div>

      {isExpanded && (
        <div className={styles.prestigeContent}>
          <p className={styles.info}>
            Скинь прогрес, щоб отримати Робокоїни. Кожен Робокоїн дає <span className={styles.highlight}>+10%</span> до доходу.
          </p>
          <div className={styles.stats}>
            <p>Поточні Робокоїни: <span>{prestigeData.robocoins.toFixed(2)}</span></p>
            <p>Бонус зараз: <span>+{prestigeData.bonusPercent}%</span></p>
            <p>Робокоїни після скидання: <span>+{robocoinsOnReset.toFixed(2)}</span></p>
            <p>Новий загальний бонус: <span>+{newBonus}%</span></p>
          </div>
          <button
            className={styles.prestigeButton}
            onClick={handlePrestige}
            disabled={robocoinsOnReset < 0.01}
          >
            СКИНУТИ ЗА +{robocoinsOnReset.toFixed(2)} ROBOCOINS
          </button>
        </div>
      )}
    </div>
  );
}
