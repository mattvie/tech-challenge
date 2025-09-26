import React from 'react';
import { clsx } from 'clsx';
import styled from 'styled-components';

type BoxProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export const Box = React.forwardRef<HTMLElement, BoxProps>(
  ({ as: Component = 'div', className, children, ...props }, ref) => {
    return (
      <Component ref={ref as any} className={clsx(className)} {...props}>
        {children}
      </Component>
    );
  }
);
Box.displayName = 'Box';

type FlexProps = Omit<BoxProps, 'as'>;

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, ...props }, ref) => {
    return <Box ref={ref} className={clsx('flex', className)} {...props} />;
  }
);
Flex.displayName = 'Flex';

type TextProps = Omit<BoxProps, 'as'> & {
  as?: 'p' | 'span' | 'div' | 'label';
};

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as: Component = 'p', ...props }, ref) => {
    return <Box ref={ref} as={Component} {...props} />;
  }
);
Text.displayName = 'Text';

type HeadingProps = Omit<BoxProps, 'as'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', className, ...props }, ref) => {
    const baseClasses = 'font-bold tracking-tight text-gray-900';
    return (
      <Box
        ref={ref}
        as={Component}
        className={clsx(baseClasses, className)}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';


// Mantido ara não quebrar o layout existente
export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  
  @media (min-width: 640px) { max-width: 640px; }
  @media (min-width: 768px) { max-width: 768px; }
  @media (min-width: 1024px) { max-width: 1024px; }
  @media (min-width: 1280px) { max-width: 1280px; }
`;

export * from './Button';