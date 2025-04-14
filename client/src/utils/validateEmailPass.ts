export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{};:'",.<>/?\\|`~+=_-]).{6,}$/;

  return regex.test(password);
};
