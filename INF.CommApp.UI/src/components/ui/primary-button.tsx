import * as React from 'react';
import { Button } from './button';
import { cn } from './utils';

interface PrimaryButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "bg-[#2563eb] hover:bg-[#1d4ed8] text-white",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}