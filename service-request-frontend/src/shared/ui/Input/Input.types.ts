import type { MouseEventHandler } from 'react';
import type { IconType } from '../Icon/Icon';

export interface InputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onClick'
  > {
  label?: string;
  icon?: IconType;
  error?: string;
  inputIcon?: IconType;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}
