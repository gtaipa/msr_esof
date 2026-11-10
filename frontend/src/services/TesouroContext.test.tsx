import { renderHook } from '@testing-library/react';
import { useServicoTesouro } from './TesouroContext';

it('dá um erro claro se faltar o TesouroProvider', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useServicoTesouro())).toThrow(/TesouroProvider/);
});
