import type { IconType } from '../Icon/Icon';

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 's' | 'm' | 'boxed' | 'sm';
  appearance?:
    | 'primary'
    | 'ghost'
    | 'default'
    | 'blue'
    | 'ghost-blue'
    | 'danger';
  icon?: IconType;
  border?: 'border-black' | 'border-ghost' | 'none';
  typeOf?: 'button' | 'link' | 'div';
  path?: string;
  iconClassName?: string;
}
