import { ReactNode } from 'react';

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  classNames?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function IconButton({
  onClick,
  icon,
  classNames = '',
  type = 'button',
}: IconButtonProps) {
  return (
    <button onClick={onClick} className={classNames} type={type}>
      {icon}
    </button>
  );
}
