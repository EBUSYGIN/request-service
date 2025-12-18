import { memo } from 'react';
import cn from 'classnames';
import { Link } from 'react-router';
import { Icon } from '../Icon/Icon';

import styles from './Button.module.css';
import type { ButtonProps } from './Button.types';

export const Button = memo(
  ({
    size = 'm',
    appearance = 'default',
    border = 'none',
    className,
    children,
    icon,
    typeOf = 'button',
    path = '',
    iconClassName,
    ...props
  }: ButtonProps) => {
    const IconComponent = icon ? Icon[icon] : null;

    if (typeOf === 'link') {
      return (
        <Link
          to={path}
          className={cn(
            styles.button,
            styles[size],
            styles[appearance],
            styles[border],
            styles.link,
            className
          )}
        >
          {IconComponent && (
            <IconComponent
              className={cn(styles.icon, styles.iconPosition, iconClassName)}
            />
          )}
          {children}
        </Link>
      );
    }
    if (typeOf === 'div') {
      return (
        <div
          className={cn(
            styles.button,
            styles[size],
            styles[appearance],
            styles[border],
            className
          )}
        >
          {IconComponent && (
            <IconComponent
              className={cn(styles.icon, styles.iconPosition, iconClassName)}
            />
          )}
          {children}
        </div>
      );
    }
    return (
      <button
        className={cn(
          styles.button,
          styles[size],
          styles[appearance],
          styles[border],
          className
        )}
        {...props}
      >
        {IconComponent && (
          <IconComponent
            className={cn(styles.icon, styles.iconPosition, iconClassName)}
          />
        )}
        {children}
      </button>
    );
  }
);
