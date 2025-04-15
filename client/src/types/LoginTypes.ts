export type ModalProps = {
  closeModal: () => void;
};

export type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export type PasswordRules = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  special: boolean;
};

export type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showChecklist?: boolean;
  setPasswordRules: React.Dispatch<React.SetStateAction<PasswordRules>>;
  required?: boolean;
  passwordRules: PasswordRules;
};
