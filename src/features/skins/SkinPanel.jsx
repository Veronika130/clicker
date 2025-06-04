import styles from "../../styles/SkinPanel.module.scss";
import { useState } from 'react';

export default function SkinPanel({ gameState, setGameState }) {
  const { credits, skins = {} } = gameState;
  const [activeSkin, setActiveSkin] = useState(gameState.activeSkin || null);

  const skinCases = [
    {
      id: 'neon',
      name: 'Неонова тема',
      description: 'Чорний фон з яскравими кольорами',
      price: 10000,
      colors: ['#000', '#39FF14', '#DA70D6'],
    },
    {
      id: 'sunset',
      name: 'Захід сонця',
      description: 'Тепла помаранчева гама',
      price: 5000,
      colors: ['#FF5E3A', '#FF9500', '#FFCC00'],
    },
    {
      id: 'aqua',
      name: 'Аква стиль',
      description: 'Свіжі морські кольори',
      price: 7000,
      colors: ['#00FFFF', '#008080', '#004C4C'],
    }
  ];

  const buySkin = (skin) => {
    if (credits < skin.price || skins[skin.id]) return;

    setGameState(prev => ({
      ...prev,
      credits: prev.credits - skin.price,
      skins: {
        ...prev.skins,
        [skin.id]: true
      },
      activeSkin: skin.id
    }));

    setActiveSkin(skin.id);
  };

  const activateSkin = (skinId) => {
    if (activeSkin === skinId) return;

    setGameState(prev => ({
      ...prev,
      activeSkin: skinId
    }));

    setActiveSkin(skinId);
  };

  return (
    <div className={styles.skinGrid}>
      {skinCases.map(skin => {
        const isOwned = skins[skin.id];
        const isActive = skin.id === activeSkin;

        return (
          <div key={skin.id} className={styles.skinCard}>
            <p className={styles.level}>Скін</p>
            <div className={styles.title}>{skin.name}</div>
            <div className={styles.description}>{skin.description}</div>
            <div className={styles.previewBox}>
              {skin.colors.map((color, index) => (
                <div
                  key={index}
                  className={styles.colorBlock}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
            <div className={styles.price}>₴{skin.price.toLocaleString()}</div>
            <div className={styles.status}>
              {isOwned ? '✅ Куплено' : '❌ Не куплено'}
            </div>

            <button
              disabled={
                (!isOwned && credits < skin.price) || (isOwned && isActive)
              }
              onClick={() => {
                if (isOwned) {
                  activateSkin(skin.id);
                } else {
                  buySkin(skin);
                }
              }}
            >
              {isOwned
                ? isActive
                  ? 'Активовано'
                  : 'Активувати'
                : 'Купити'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
