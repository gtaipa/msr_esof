import { MEDALHAS } from '../data/acervo';
import { medalhasGanhas } from './medalhas';

describe('medalhasGanhas', () => {
  it.each([
    [0, []],
    [1, ['m1']],
    [3, ['m1', 'm2']],
    [8, ['m1', 'm2', 'm3']],
  ])('com %i obras ganha %j', (total, ids) => {
    expect(medalhasGanhas(total, MEDALHAS).map((m) => m.id)).toEqual(ids);
  });
});
