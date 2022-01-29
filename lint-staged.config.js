/* eslint-disable no-undef */
module.exports = {
  '*.{js,tx,tsx}': ['yarn lint --max-warnings 0 --fix'],
  '*.{json,md,less,yaml,yml}': 'prettier --write',
};
