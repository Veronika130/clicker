import styles from '../styles/CasePanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcaseMedical } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, useRef } from 'react';

export default function CasePanel({ gameState, setGameState }) {
  const { credits, caseStats = {}, lastCaseReward, lastCaseOpened } = gameState;
  const [remainingTime, setRemainingTime] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    const reward = lastCaseReward;
    if (
      reward?.type === 'clickValueMultiply' &&
      reward?.activatedAt &&
      reward?.duration
    ) {
      const now = Date.now();
      const elapsed = now - reward.activatedAt;
      const timeLeft = Math.max(0, reward.duration - elapsed);

      if (timeLeft <= 0) {
        setGameState(prev => ({
          ...prev,
          clickValue: reward.originalClickValue ?? 1,
          lastCaseReward: null,
        }));
        return;
      }

      setRemainingTime(Math.ceil(timeLeft / 1000));

      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const newLeft = Math.ceil((reward.activatedAt + reward.duration - Date.now()) / 1000);
        if (newLeft <= 0) {
          clearInterval(intervalRef.current);
          setRemainingTime(0);
          setGameState(prev => ({
            ...prev,
            clickValue: reward.originalClickValue ?? 1,
            lastCaseReward: null,
          }));
        } else {
          setRemainingTime(newLeft);
        }
      }, 1000);
    } else {
      setRemainingTime(0);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [lastCaseReward, setGameState]);

  const cases = [
    { id: 'basic', name: 'Звичайний кейс', description: 'Містить прості нагороди з шансом на бонус', price: 100 },
    { id: 'rare', name: 'Рідкісний кейс', description: 'Краще співвідношення шансів і нагород', price: 1000 },
    { id: 'epic', name: 'Епічний кейс', description: 'Високі нагороди гарантовано', price: 10000 },
    { id: 'skin', name: 'Кейс зі скінами', description: 'Відкриває нові стилі інтерфейсу', price: 500000 },
  ];

  const openCase = (c) => {
    if (credits < c.price) return;

    const rewards = [
      { label: '+100 коінів', type: 'credits', value: 100 },
      { label: 'x2 загальний дохід на 30с', type: 'globalMultiplier', value: 2, duration: 30000 },
      { label: 'Мем з’являється на 5с', type: 'funMessage', message: 'Випадковий мем!', duration: 5000 },
      { label: 'Нічого не впало', type: 'none' },
      { label: 'Блокування кліків на 10с', type: 'clickDisabled', duration: 10000 },
      { label: '-25% від усіх накопичених кредитів', type: 'creditsPercentageLoss', value: 25 },
      { label: 'Всі апгрейди зменшено на 1 рівень', type: 'downgradeAll', value: 1 },
      { label: 'Всі апгрейди +1 рівень', type: 'upgradeAll', value: 1 }
    ];

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setRewardMessage(`Ви отримали: ${reward.label}`);
    setTimeout(() => setRewardMessage(''), 4000);

    setGameState(prev => {
      let newCredits = prev.credits - c.price;
      let updatedState = { ...prev, credits: newCredits, lastCaseReward: reward, lastCaseOpened: c };

      if (reward.type === 'credits') {
        newCredits += reward.value;
        updatedState.credits = newCredits;
      } else if (reward.type === 'creditsPercentageLoss') {
        const loss = Math.floor((prev.credits || 0) * (reward.value / 100));
        updatedState.credits = Math.max(0, prev.credits - loss);
      } else if (reward.type === 'clickDisabled') {
        updatedState.canClick = false;
        setTimeout(() => {
          setGameState(prev => ({ ...prev, canClick: true }));
        }, reward.duration);
      } else if (reward.type === 'globalMultiplier') {
        updatedState.globalMultiplier = reward.value;
        setTimeout(() => {
          setGameState(prev => ({ ...prev, globalMultiplier: 1 }));
        }, reward.duration);
      } else if (reward.type === 'downgradeAll') {
        const downgraded = { ...prev.upgrades };
        Object.keys(downgraded).forEach(key => {
          downgraded[key] = Math.max(0, (downgraded[key] || 0) - reward.value);
        });
        updatedState.upgrades = downgraded;

        const clickLevel = downgraded.click ?? 0;
        updatedState.clickValue = clickLevel === 0
          ? 1
          : 1 + [...Array(clickLevel).keys()].map(i => (i === 0 ? 1 : i * 2 + 1)).reduce((a, b) => a + b, 0);
        updatedState.autoClickers = downgraded.auto ?? 0;
        updatedState.passiveIncome = (downgraded.passive ?? 0) * 5;
        updatedState.critChance = Math.min((downgraded.crit ?? 0) * 5, 100);
      } else if (reward.type === 'upgradeAll') {
        const upgraded = { ...prev.upgrades };
        Object.keys(upgraded).forEach(key => {
          upgraded[key] = (upgraded[key] || 0) + reward.value;
        });
        updatedState.upgrades = upgraded;

        const clickLevel = upgraded.click ?? 0;
        updatedState.clickValue = clickLevel === 0
          ? 1
          : 1 + [...Array(clickLevel).keys()].map(i => (i === 0 ? 1 : i * 2 + 1)).reduce((a, b) => a + b, 0);
        updatedState.autoClickers = upgraded.auto ?? 0;
        updatedState.passiveIncome = (upgraded.passive ?? 0) * 5;
        updatedState.critChance = Math.min((upgraded.crit ?? 0) * 5, 100);
      } else if (reward.type === 'funMessage') {
        console.log('🎉 Meme:', reward.message);
      }

      updatedState.stats = {
        ...updatedState.stats,
        totalCasesOpened: (updatedState.stats?.totalCasesOpened || 0) + 1
      };

      updatedState.caseStats = {
        ...updatedState.caseStats,
        [c.id]: (updatedState.caseStats?.[c.id] || 0) + 1
      };

      return updatedState;
    });
  };

  return (
    <>
      {rewardMessage && (
        <div style={{
          background: '#dff0d8',
          color: '#3c763d',
          border: '1px solid #d6e9c6',
          padding: '10px 20px',
          borderRadius: '8px',
          margin: '10px auto',
          width: 'fit-content',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          {rewardMessage}
        </div>
      )}

      <div className={styles.caseGrid}>
        {cases.map((c) => (
          <div key={c.id} className={styles.caseCard} data-case-id={c.id}>
            <p className={styles.level}>Кейс</p>
            <FontAwesomeIcon icon={faBriefcaseMedical} style={{ fontSize: '48px', color: '#63E6BE', marginBottom: '10px' }} />
            <div className={styles.title}>{c.name}</div>
            <div className={styles.description}>{c.description}</div>
            <div className={styles.price}>₴{c.price.toLocaleString()}</div>
            <div className={styles.opened}>Відкрито: {caseStats?.[c.id] || 0}</div>
            <button disabled={credits < c.price} onClick={() => openCase(c)}>
              Відкрити
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
