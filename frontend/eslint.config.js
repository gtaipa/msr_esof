// Análise estática do frontend (RNF-05). Corre no CI: o PR fica vermelho se houver erros.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'dev-dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Sem console.log esquecidos; console.warn/error são permitidos para diagnóstico.
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
);
