import { FaInfoCircle, FaBars } from 'react-icons/fa';
import styles from './topBar.module.scss'
function ChatTopBar() {
  return (
    <div className={styles.topBar}>
      <div className={styles.menuIcon}>
        <FaBars />
      </div>
      <div className={styles.title}>Chat App</div>
      <div className={styles.infoIcon}>
        <FaInfoCircle />
      </div>
    </div>
  );
}

export default ChatTopBar;