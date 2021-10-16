/**
 * @fileoverview Strict JSX expressions for safe conditional renders.
 * @author Heather Persson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/strict-jsx-expressions"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("strict-jsx-expressions", rule, {
  valid: [
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "let num; <App>{num && <Foo/>}</App>",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});
