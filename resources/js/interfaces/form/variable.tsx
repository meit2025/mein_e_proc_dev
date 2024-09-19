export type InputType = 'input' | 'select' | 'checkbox' | 'multiselect' | 'file';
export type TextType = 'text' | 'date' | 'number' | 'password' | 'email';
export interface Option<T> {
  label: string;
  value: T;
}
