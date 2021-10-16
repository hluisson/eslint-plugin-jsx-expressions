/**
 * @fileoverview Strict JSX expressions for safe conditional renders.
 * @author Heather Persson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import rule from "../../../lib/rules/strict-logical-expressions";
import { getFixturesRootDir } from "../util";

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new ESLintUtils.RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {},
    tsconfigRootDir: getFixturesRootDir(),
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
});

ruleTester.run("strict-logical-expressions", rule, {
  valid: [
    {
      code: ['const str = "Foo";', "<App>{str && <Foo/>}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ["const num = 100;", "<App>{num && <Foo />}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ['let str = "Foo";', "<App>{!!str && <Foo />}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ["let num = 100;", "<App>{!!num && <Foo />}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ["let num = 100;", "<App>{Boolean(num) && <Foo />}</App>"].join(
        "\n"
      ),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ['let str = "Foo";', "<App>{Boolean(str) && <Foo />}</App>"].join(
        "\n"
      ),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      filename: "react.tsx",
    },
    {
      code: ["let num = 100;", "<App>{num && <Foo />}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      options: [{ allowNumber: true }],
      filename: "react.tsx",
    },
    {
      code: ['let str = "foo";', "<App>{str && <Foo />}</App>"].join("\n"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      options: [{ allowString: true }],
      filename: "react.tsx",
    },
  ],
  invalid: [
    {
      code: ["let num = 100;", "<App>{num && <Foo/>}</App>"].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyNumber" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: ["let num = 100;", "<App>{!!num && <Foo/>}</App>"].join("\n"),
      filename: "react.tsx",
    },
    {
      code: ['let str = "foo";', "<App>{str && <Foo/>}</App>"].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyString" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: ['let str = "foo";', "<App>{!!str && <Foo/>}</App>"].join("\n"),
      filename: "react.tsx",
    },
    {
      code: ["const num = 0;", "<App>{num && <Foo/>}</App>"].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyNumber" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: ["const num = 0;", "<App>{!!num && <Foo/>}</App>"].join("\n"),
      filename: "react.tsx",
    },
    {
      code: ['const str = "";', "<App>{str && <Foo/>}</App>"].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyString" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: ['const str = "";', "<App>{!!str && <Foo/>}</App>"].join("\n"),
      filename: "react.tsx",
    },
    {
      code: [
        "let thisOrThat: Record<any, any> | string;",
        "<App>{thisOrThat && <Foo/>}</App>",
      ].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyString" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: [
        "let thisOrThat: Record<any, any> | string;",
        "<App>{!!thisOrThat && <Foo/>}</App>",
      ].join("\n"),
      filename: "react.tsx",
    },
    {
      code: [
        "let thisOrThat: Record<any, any> | number;",
        "<App>{thisOrThat && <Foo/>}</App>",
      ].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyNumber" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: [
        "let thisOrThat: Record<any, any> | number;",
        "<App>{!!thisOrThat && <Foo/>}</App>",
      ].join("\n"),
      filename: "react.tsx",
    },
    {
      code: [
        'const first = { foo: "bar" };',
        'let second = "foo";',
        "<App>{first && second && <Foo/>}</App>",
      ].join("\n"),
      errors: [{ messageId: "conditionErrorFalseyString" }],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      output: [
        'const first = { foo: "bar" };',
        'let second = "foo";',
        "<App>{first && !!second && <Foo/>}</App>",
      ].join("\n"),
      filename: "react.tsx",
    },
  ],
});
