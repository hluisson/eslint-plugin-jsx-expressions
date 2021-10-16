# eslint-plugin-jsx-expressions

Rules for safe logical expressions in JSX

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-jsx-expressions`:

```sh
npm install eslint-plugin-jsx-expressions --save-dev
```

## Usage

Add `jsx-expressions` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["jsx-expressions"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jsx-expressions/strict-logical-expressions": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
