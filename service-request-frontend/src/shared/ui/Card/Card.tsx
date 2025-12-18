import cn from 'classnames';

import type { CardProps } from './Card.types';
import styles from './Card.module.css';

export function Card({ children, className }: CardProps) {
  return <div className={cn(styles.card, className)}>{children}</div>;
}
