import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, LabelHTMLAttributes, HTMLAttributes } from 'react';
import { clsx } from 'clsx';

// Componente base para o formulário
export const Form = React.forwardRef<HTMLFormElement, HTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form
      ref={ref}
      className={clsx('flex flex-col gap-4', className)}
      {...props}
    />
  )
);
Form.displayName = 'Form';

// Componente para agrupar Label, Input e ErrorText
export const FormGroup = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('flex flex-col gap-2', className)}
      {...props}
    />
  )
);
FormGroup.displayName = 'FormGroup';

// Label do formulário
export const Label = React.forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx('text-sm font-medium text-gray-700 cursor-pointer', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

// Props comuns para inputs
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

// Input de texto, email, password, etc.
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    const ringColor = hasError ? 'focus:ring-red-500/30' : 'focus:ring-primary-500/30';
    const borderColor = hasError ? 'border-red-500' : 'border-gray-300 focus:border-primary-500';

    return (
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 rounded-md text-base transition-colors duration-200',
          'placeholder-gray-400 border',
          'focus:outline-none focus:ring-2',
          borderColor,
          ringColor,
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Props para a Textarea
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

// Textarea
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, hasError, ...props }, ref) => {
    const ringColor = hasError ? 'focus:ring-red-500/30' : 'focus:ring-primary-500/30';
    const borderColor = hasError ? 'border-red-500' : 'border-gray-300 focus:border-primary-500';

    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 rounded-md text-base transition-colors duration-200',
          'placeholder-gray-400 border resize-vertical min-h-[120px]',
          'focus:outline-none focus:ring-2',
          borderColor,
          ringColor,
          className
        )}
        {...props}
      />
    );
  }
);
TextArea.displayName = 'TextArea';

// Props para o Select
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

// Select (dropdown)
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, ...props }, ref) => {
    const ringColor = hasError ? 'focus:ring-red-500/30' : 'focus:ring-primary-500/30';
    const borderColor = hasError ? 'border-red-500' : 'border-gray-300 focus:border-primary-500';
    
    return (
      <select
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 rounded-md text-base transition-colors duration-200',
          'border bg-white cursor-pointer',
          'focus:outline-none focus:ring-2',
          borderColor,
          ringColor,
          className
        )}
        {...props}
      />
    );
  }
);
Select.displayName = 'Select';

// Texto de erro
export const ErrorText = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-red-600', className)}
      {...props}
    />
  )
);
ErrorText.displayName = 'ErrorText';

// Texto de ajuda
export const HelpText = React.forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx('text-sm text-gray-500', className)}
      {...props}
    />
  )
);
HelpText.displayName = 'HelpText';


// Componente de FileInput corrigido e estilizado com Tailwind
export const FileInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className={clsx("w-full", className)}>
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
            </div>
            <input id="file-upload" ref={ref} type="file" className="hidden" {...props} />
        </label>
      </div> 
    );
  }
);
FileInput.displayName = 'FileInput';