import Usuario from './src/models/Usuario.ts';
try {
  const res = await Usuario.ensureFromCadastro({ cpf: '33344455566', email_1: 'carla.m@email.com', email_2: 'contato@carla.com', telefone: '(31) 96666-3333', nome: 'Carla Mendes' });
  console.log(JSON.stringify(res));
} catch (e) {
  console.error(e);
}
