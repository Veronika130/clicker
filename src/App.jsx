import { useState, useEffect } from 'react';
import { db } from './db/db';
import './styles/SkinThemes.scss';
import { useSaveProgress } from './hooks/useSaveProgress';
import coin from './imgs/coin.png';
import { useClicker } from './hooks/useClicker';
import PrestigeButton from './features/prestige/PrestigeButton';
import styles from './styles/App.module.scss';
import UpgradePanel from './components/UpgradePanel';
import CasePanel from './components/CasePanel';
import SkinPanel from './features/skins/SkinPanel';
import AchievementPanel from './features/achievements/AchievementPanel';

const tabLabels = ['Покращення', 'Кейси', 'Скіни', 'Досягнення'];

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const load = async () => {
      const saved = await db.progress.get('state');
      let state = saved?.value ?? {
        credits: 0,
        clickValue: 1,
        upgrades: {},
        autoClickers: 0,
        passiveIncome: 0,
        critChance: 0,
        clickMultiplier: 1,
        canClick: true,
        globalMultiplier: 1,
        lastCaseReward: null,
        prestige: { robocoins: 0, bonusPercent: 0 },
        caseStats: {},
        skins: {},
        activeSkin: null,
        stats: {
          totalClicks: 0,
          totalCreditsEarned: 0,
          totalCasesOpened: 0,
          totalUpgrades: 0,
        }
      };

      state.credits = Number.isFinite(state.credits) ? state.credits : 0;
      state.clickValue = (state.clickValue > 0 && Number.isFinite(state.clickValue)) ? state.clickValue : 1;

      setGameState(state);
      setIsLoading(false);
    };

    load();
  }, []);

  useSaveProgress(gameState);

  const { handleClick } = useClicker(gameState, setGameState);

  useEffect(() => {
    if (!gameState?.lastCaseReward) return;

    const reward = gameState.lastCaseReward;
    const value = reward.value;
    const duration = reward.duration ?? 0;

    setGameState(prev => {
      let next = { ...prev, lastCaseReward: null };

      switch (reward.type) {
        case 'credits':
          next.credits += value;
          break;
        case 'clickValue':
          next.clickValue += value;
          break;
        case 'clickValueMultiply':
          next.clickValue *= value;
          setTimeout(() =>
            setGameState(p => ({ ...p, clickValue: p.clickValue / value }))
          , duration);
          break;
        case 'creditsPercentageLoss':
          next.credits -= next.credits * 0.25;
          break;
        case 'globalMultiplier':
          next.globalMultiplier = value;
          setTimeout(() =>
            setGameState(p => ({ ...p, globalMultiplier: 1 }))
          , duration);
          break;
        case 'clickDisabled':
          next.canClick = false;
          setTimeout(() =>
            setGameState(p => ({ ...p, canClick: true }))
          , duration);
          break;
        case 'downgradeAll':
          const downgraded = { ...next.upgrades };
          Object.keys(downgraded).forEach(k => {
            downgraded[k] = Math.max(0, (downgraded[k] || 0) - 1);
          });
          next.upgrades = downgraded;
          next.clickValue = 1 + [...Array(downgraded.click || 0).keys()].map(i => (i === 0 ? 1 : i * 2 + 1)).reduce((a, b) => a + b, 0);
          next.autoClickers = downgraded.auto || 0;
          next.passiveIncome = (downgraded.passive || 0) * 5;
          next.critChance = Math.min((downgraded.crit || 0) * 5, 100);
          break;
        case 'funMessage':
          console.log("🎉 Мем: ", reward.label);
          break;
      }

      return next;
    });
  }, [gameState?.lastCaseReward]);

  if (isLoading || !gameState) return <p className={styles.loading}>⏳ Loading...</p>;

  return (
    <div className={`app-wrapper theme--${gameState?.activeSkin || 'default'}`}>
      <div className={styles.appContainer}>
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>ClickNow</h1>
          <p className={styles.credits}>{Math.floor(gameState.credits)} Коіни</p>
          <img
            src={coin}
            alt="Click"
            className={styles.clickImage}
            onClick={handleClick}
            style={{
              cursor: "pointer",
              pointerEvents: "auto",
              zIndex: 10,
              width: "320px",
              height: "auto"
            }}
          />
          <PrestigeButton gameState={gameState} setGameState={setGameState} />
        </div>

        <div className={styles.tabWrapper}>
          <div className={styles.tabList}>
            {tabLabels.map((label, index) => {
              const tabClass = [
                styles.tabItem,
                `tabItem--${index}`,
                activeTab === index ? `activeTab--${label.toLowerCase()}` : ''
              ].join(' ');

              return (
                <div
                  key={label}
                  className={tabClass}
                  onClick={() => setActiveTab(index)}
                >
                  {label.split('').map((char, i) => (
                    <span key={i}>{char}</span>
                  ))}
                </div>
              );
            })}
          </div>

          <div className={`tabContent--${tabLabels[activeTab].toLowerCase()} ${styles.tabContent}`}>
            {activeTab === 0 && (
              <div className={styles.upgradeContainer}>
                <UpgradePanel
                  credits={Math.floor(gameState.credits)}
                  upgrades={gameState.upgrades}
                  upgradeClick={(type, price) => {
                    if (gameState.credits < price) return;

                    setGameState(prev => {
                      const level = prev.upgrades?.[type] || 0;
                      const upgrades = { ...prev.upgrades, [type]: level + 1 };

                      let clickValue = prev.clickValue;
                      let auto = prev.autoClickers || 0;
                      let passive = prev.passiveIncome || 0;
                      let crit = prev.critChance || 0;

                      if (type === 'click') clickValue += level === 0 ? 1 : level * 2 + 1;
                      if (type === 'auto') auto += 1;
                      if (type === 'passive') passive += 5;
                      if (type === 'crit') crit = Math.min((level + 1) * 5, 100);

                      return {
                        ...prev,
                        credits: prev.credits - price,
                        clickValue,
                        autoClickers: auto,
                        passiveIncome: passive,
                        critChance: crit,
                        upgrades,
                        stats: {
                          ...prev.stats,
                          totalUpgrades: (prev.stats?.totalUpgrades || 0) + 1,
                        }
                      };
                    });
                  }}
                />
              </div>
            )}
            {activeTab === 1 && (
              <div className={styles.caseContainer}>
                <CasePanel gameState={gameState} setGameState={setGameState} />
              </div>
            )}
            {activeTab === 2 && (
              <div className={styles.skinContainer}>
                <SkinPanel gameState={gameState} setGameState={setGameState} />
              </div>
            )}
            {activeTab === 3 && (
              <div className={styles.achievementContainer}>
                <AchievementPanel gameState={gameState} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
