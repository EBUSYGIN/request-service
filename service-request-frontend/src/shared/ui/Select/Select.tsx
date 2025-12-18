import { forwardRef } from 'react';
import cn from 'classnames';

import styles from './Select.module.css';
import { Icon } from '../Icon/Icon';
import type { SelectProps } from './Select.types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      optionsItems,
      error,
      label,
      icon,
      valueToReturn,
      children,
      ...props
    },
    ref
  ) => {
    const IconComponent = icon ? Icon[icon] : null;

    return (
      <div className={cn(className, styles.selectBox)}>
        {label && (
          <label className={styles.label}>
            {label}
            {IconComponent && <IconComponent />}
          </label>
        )}
        <select
          ref={ref}
          className={cn(styles.select, { [styles.invalid]: error })}
          {...props}
        >
          {children ||
            optionsItems?.map((option) => (
              <option
                key={option.id}
                value={valueToReturn === 'id' ? option.id : option.name}
              >
                {option.name}
              </option>
            ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
