import { ESLintUtils, TSESTree } from "@typescript-eslint/experimental-utils";
import * as tsutils from "tsutils";
import * as ts from "typescript";
import { createRule } from "../util/createRule";
import { getConstrainedTypeAtLocation } from "../util/types";

type Options = [
  {
    allowString?: boolean;
    allowNumber?: boolean;
  }
];

type MessageIds = "conditionErrorFalseyString" | "conditionErrorFalseyNumber";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default createRule<Options, MessageIds>({
  name: "strict-logical-expressions",
  defaultOptions: [{ allowString: false, allowNumber: false }],
  meta: {
    docs: {
      description: "Forbid non-boolean falsey values in inline expressions",
      recommended: "error",
    },
    fixable: "code",
    type: "problem",
    schema: [
      {
        type: "object",
        properties: {
          allowString: { type: "boolean" },
          allowNumber: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      conditionErrorFalseyString:
        "Potentially falsey string in logical AND expression. Please use boolean.",
      conditionErrorFalseyNumber:
        "Potentially falsey number in logical AND expression. Please use boolean.",
    },
  },

  create(context, [options]) {
    const parserServices = ESLintUtils.getParserServices(context);
    const typeChecker = parserServices.program.getTypeChecker();

    function checkIdentifier(node: TSESTree.Identifier) {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node);
      const types = tsutils.unionTypeParts(
        getConstrainedTypeAtLocation(typeChecker, tsNode)
      );

      const hasPotentiallyFalseyString = types.some(
        (type) =>
          tsutils.isTypeFlagSet(type, ts.TypeFlags.StringLike) &&
          (!type.isStringLiteral() || type.value === "")
      );

      if (!options.allowString && hasPotentiallyFalseyString) {
        context.report({
          node,
          messageId: "conditionErrorFalseyString",
          fix: (fixer) => fixer.insertTextBefore(node, "!!"),
        });
      }

      const hasPotentiallyFalseyNumber = types.some(
        (type) =>
          tsutils.isTypeFlagSet(
            type,
            ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike
          ) &&
          (!type.isNumberLiteral() || type.value === 0)
      );

      if (!options.allowNumber && hasPotentiallyFalseyNumber) {
        context.report({
          node,
          messageId: "conditionErrorFalseyNumber",
          fix: (fixer) => fixer.insertTextBefore(node, "!!"),
        });
      }
    }

    function checkLogicalExpression(
      expressionNode: TSESTree.LogicalExpression,
      checkRightNode: boolean
    ) {
      if (
        expressionNode.left.type === TSESTree.AST_NODE_TYPES.LogicalExpression
      ) {
        checkLogicalExpression(expressionNode.left, true);
      } else if (
        expressionNode.left.type === TSESTree.AST_NODE_TYPES.Identifier
      ) {
        checkIdentifier(expressionNode.left);
      }

      if (
        checkRightNode &&
        expressionNode.right.type === TSESTree.AST_NODE_TYPES.Identifier
      ) {
        checkIdentifier(expressionNode.right);
      }
    }

    function checkJSXExpression(node: TSESTree.JSXExpressionContainer) {
      if (
        node.expression.type === TSESTree.AST_NODE_TYPES.LogicalExpression &&
        node.expression.operator === "&&"
      ) {
        checkLogicalExpression(node.expression, false);
      }
    }

    return {
      JSXExpressionContainer: checkJSXExpression,
    };
  },
});
