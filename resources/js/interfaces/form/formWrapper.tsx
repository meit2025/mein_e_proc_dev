import { CSSProperties, ReactNode } from 'react';
import { InputType, Option, TextType } from './variable';

export interface FormFieldModel<T = any> {
  type: InputType;
  name: string;
  label: string;
  options?: Option<T>[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  style?: CSSProperties;
  disabled?: boolean;
  allowedExtensions?: string[];
  maxLength?: number;
  minLength?: number;
  rows?: number;
  maxRows?: number;
  texttype?: TextType;
  requiredMessage?: string;
  classNames?: string;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}
