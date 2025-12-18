import { forwardRef } from 'react';
import cn from 'classnames';

import styles from './Input.module.css';
import { Icon } from '../Icon/Icon';
import type { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      placeholder,
      className,
      label,
      icon,
      inputIcon,
      error,
      onClick,
      ...props
    },
    ref
  ) => {
    const IconComponent = icon ? Icon[icon] : null;
    const InputIconComponent = inputIcon ? Icon[inputIcon] : null;

    return (
      <div className={styles.inputBox}>
        {label && (
          <span className={styles.label}>
            {label} {IconComponent && <IconComponent />}
          </span>
        )}
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={cn(styles.input, className, { [styles.invalid]: error })}
            placeholder={placeholder}
            {...props}
          />
          {InputIconComponent && (
            <button
              onClick={onClick}
              className={styles.button}
              title='Нажмите, чтобы искать'
              type='button'
            >
              <InputIconComponent className={styles.inputIcon} />
            </button>
          )}
        </div>

        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
