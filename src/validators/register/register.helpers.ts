export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function maskCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function maskCpfCnpj(value: string) {
  const digits = onlyDigits(value);

  return digits.length > 11 ? maskCnpj(digits) : maskCpf(digits);
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function maskCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;

  for (let index = 0; index < 9; index += 1) {
    sum += Number(cpf[index]) * (10 - index);
  }

  let digit = 11 - (sum % 11);
  if (digit >= 10) {
    digit = 0;
  }

  if (digit !== Number(cpf[9])) {
    return false;
  }

  sum = 0;

  for (let index = 0; index < 10; index += 1) {
    sum += Number(cpf[index]) * (11 - index);
  }

  digit = 11 - (sum % 11);
  if (digit >= 10) {
    digit = 0;
  }

  return digit === Number(cpf[10]);
}

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  const calculateDigit = (input: string, weights: number[]) => {
    const sum = weights.reduce(
      (accumulator, weight, index) =>
        accumulator + Number(input[index]) * weight,
      0,
    );

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, ...firstWeights];

  const firstDigit = calculateDigit(cnpj.slice(0, 12), firstWeights);
  const secondDigit = calculateDigit(cnpj.slice(0, 13), secondWeights);

  return firstDigit === Number(cnpj[12]) && secondDigit === Number(cnpj[13]);
}

export function isValidCpfOrCnpj(value: string) {
  return isValidCpf(value) || isValidCnpj(value);
}

export function isValidPhone(value: string) {
  const phone = onlyDigits(value);

  return (
    (phone.length === 10 || phone.length === 11) && !/^(\d)\1+$/.test(phone)
  );
}

export function isValidCep(value: string) {
  return onlyDigits(value).length === 8;
}

export function normalizeState(value: string) {
  return value.trim().toUpperCase().slice(0, 2);
}
