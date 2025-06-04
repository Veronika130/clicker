import styles from '../styles/UpgradePanel.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBill1Wave,
  faClover,
  faHamsa,
  faUpLong,
  faStreetView,
} from '@fortawesome/free-solid-svg-icons';

const upgradesList = [
  {
    id: 'click',
    name: 'Клік-сила',
    description: 'Збільшує значення одного кліку',
    price: 10,
    icon: faUpLong,
  },
  {
    id: 'auto',
    name: 'Автоклік',
    description: 'Автоматичні кліки кожну секунду',
    price: 50,
    icon: faHamsa,
  },
  {
    id: 'crit',
    name: 'Крит-клік',
    description: 'Шанс критичного кліку з множником',
    price: 100,
    icon: faStreetView,
  },
  {
    id: 'passive',
    name: 'Пасивний дохід',
    description: 'Отримуй кредити без кліків',
    price: 200,
    icon: faMoneyBill1Wave,
  },
  {
    id: 'luck',
    name: 'Lucky Boost',
    description: 'Збільшує шанси випадкових бонусів',
    price: 500,
    icon: faClover,
  },
];

export default function UpgradePanel({ credits, upgradeClick, upgrades = {} }) {
  return (
    <div className={styles.upgradeGrid}>
      {upgradesList.map((upg) => {
        const level = upgrades[upg.id] || 0;
        const actualPrice = Math.floor(upg.price * Math.pow(1.5, level));
        const isAffordable = credits >= actualPrice;

        return (
          <div
            key={upg.id}
            className={styles.upgradeCard}
            onClick={() => isAffordable && upgradeClick(upg.id, actualPrice)}
          >
            <div className={styles.level}>Рівень {level}</div>
            <FontAwesomeIcon icon={upg.icon} className={styles.icon} />
            <div className={styles.title}>{upg.name}</div>
            <div className={styles.description}>{upg.description}</div>
            <div className={styles.price}>{actualPrice}</div>
          </div>
        );
      })}
    </div>
  );
}
