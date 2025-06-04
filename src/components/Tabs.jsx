import { useState } from 'react';
import styles from '../styles/Tabs.module.scss';
import UpgradePanel from './UpgradePanel';
import CasePanel from './CasePanel';
import SkinPanel from '../features/skins/SkinPanel';
import AchievementPanel from '../features/achievements/AchievementPanel';

export default function Tabs({ gameState, setGameState, upgradeClick }) {
  const [activeTab, setActiveTab] = useState('upgrades');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        <button onClick={() => setActiveTab('upgrades')}>UPGRADES</button>
        <button onClick={() => setActiveTab('cases')}>CASES</button>
        <button onClick={() => setActiveTab('skins')}>SKINS</button>
        <button onClick={() => setActiveTab('achievements')}>ACHIEVEMENTS</button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'upgrades' && (
          <UpgradePanel
            credits={gameState.credits}
            upgrades={gameState.upgrades}
            upgradeClick={upgradeClick}
          />
        )}
        {activeTab === 'cases' && (
          <CasePanel
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {activeTab === 'skins' && (
          <SkinPanel
            gameState={gameState}
            setGameState={setGameState}
          />
        )}
        {activeTab === 'achievements' && (
          <AchievementPanel
            gameState={gameState}
          />
        )}
      </div>
    </div>
  );
}
