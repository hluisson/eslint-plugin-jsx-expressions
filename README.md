# eslint-plugin-strict-jsx-expressions

Rules for safe logical expressions in JSX

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-strict-jsx-expressions`:

```sh
npm install eslint-plugin-strict-jsx-expressions --save-dev
```

## Usage

Add `strict-jsx-expressions` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "strict-jsx-expressions"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "strict-jsx-expressions/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


