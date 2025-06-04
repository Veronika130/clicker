import { useState } from 'react';
import styles from '../styles/Button.module.scss';

export default function ClickButton({ onClick, value, color }) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClick = () => {
    if (isDisabled) return;

    if (Math.floor(Math.random() * 10) === 0) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 10000);
    }

    onClick();
  };

  return (
    <button
      className={styles.clickButton}
      onClick={handleClick}
      disabled={isDisabled}
      style={{
        background: color || '#4CAF50',
        color: '#000',
        border: 'none',
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      {isDisabled ? '⏳ Wait...' : `+₴${value}`}
    </button>
  );
}
