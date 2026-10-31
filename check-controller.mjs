import BabaController from './src/controllers/baba_controller.ts';
const req = { body: { nome: 'Carla Mendes', cpf: '333.444.555-66', telefone: '(31) 96666-3333', email_1: 'carla.m@email.com', email_2: 'contato@carla.com', status_cadastro: 'Ativa' } };
const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(payload) { console.log('JSON', JSON.stringify(payload)); }, sendStatus(code) { console.log('SEND', code); } };
const next = (err) => { console.error('NEXT', err); };
await BabaController.create(req, res, next);
