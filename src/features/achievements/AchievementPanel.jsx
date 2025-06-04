import styles from '../../styles/Achievement.module.scss';

export default function AchievementPanel({ gameState }) {
  if (!gameState?.stats) return null;

  const {
    totalCreditsEarned = 0,
    totalClicks = 0,
    totalCasesOpened = 0,
    totalUpgrades = 0
  } = gameState.stats;

  const skinsUnlocked = Object.keys(gameState.skins || {}).length;
  const robocoins = gameState.prestige?.robocoins ?? 0;

  const achievements = [
    {
      title: 'Зароблено монет',
      progress: totalCreditsEarned,
      goal: 1000,
    },
    {
      title: 'Кількість кліків',
      progress: totalClicks,
      goal: 500,
    },
    {
      title: 'Відкрито кейсів',
      progress: totalCasesOpened,
      goal: 100,
    },
    {
      title: 'Куплено покращень',
      progress: totalUpgrades,
      goal: 50,
    },
    {
      title: 'Скіни розблоковано',
      progress: skinsUnlocked,
      goal: 3,
    },
    {
      title: 'РобоКоїни (престиж)',
      progress: robocoins,
      goal: 3,
    },
  ];

  return (
    <div className={styles.achievementGrid}>
      {achievements.map((a, index) => {
        const percent = Math.min(100, (a.progress / a.goal) * 100).toFixed(1);

        return (
          <div key={index} className={styles.achievementCard}>
            <h4>{a.title}</h4>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div>{Math.floor(a.progress)} / {a.goal}</div>
          </div>
        );
      })}
    </div>
  );
}
