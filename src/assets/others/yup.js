const strings = {
  required: 'Campo obrigatório',
  string: 'Valor inválido',
  number: 'Valor inválido',
  maxLength: size => `Tamanho máximo de ${size} caracteres`,
  minLength: size => `Tamanho mínimo de ${size} caracteres`,
  length: size => `Tamanho deve ser de ${size} caracteres`,
  email: 'Digite um e-mail válido',
  date: 'Digite uma data válida dd/mm/AAAA',
  phone: 'Digite um número de celular válido',
};

export default strings;
