import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
//import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  //pluginReactConfig,
];