import cn from 'classnames';
import styles from './Loading.module.css';

interface LoadingProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  inline?: boolean;
}

export function Loading({
  text = 'Загрузка...',
  size = 'medium',
  fullPage = false,
  inline = false,
}: LoadingProps) {
  if (inline) {
    return (
      <span className={styles.inline}>
        <span className={styles.spinner} />
        {text && <span className={styles.text}>{text}</span>}
      </span>
    );
  }

  return (
    <div
      className={cn(styles.wrapper, {
        [styles.fullPage]: fullPage,
        [styles.small]: size === 'small',
        [styles.large]: size === 'large',
      })}
    >
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}

