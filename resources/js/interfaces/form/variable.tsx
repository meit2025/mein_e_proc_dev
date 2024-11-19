export type InputType =
  | 'switch'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'multiselect'
  | 'file';
export type TextType = 'text' | 'date' | 'number' | 'password' | 'email';
export interface Option<T> {
  label: string;
  value: T;
}
