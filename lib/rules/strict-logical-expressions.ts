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

    function checkIdentifier(
      node: TSESTree.Identifier
    ): MessageIds | undefined {
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
        return "conditionErrorFalseyString";
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
        return "conditionErrorFalseyNumber";
      }
    }

    function checkLogicalExpression(
      expressionNode: TSESTree.LogicalExpression,
      checkRightNode: boolean
    ) {
      let leftNode = expressionNode.left;
      if (
        leftNode.type === TSESTree.AST_NODE_TYPES.MemberExpression &&
        leftNode.property.type !== TSESTree.AST_NODE_TYPES.PrivateIdentifier
      ) {
        leftNode = leftNode.property;
      }

      if (leftNode.type === TSESTree.AST_NODE_TYPES.LogicalExpression) {
        checkLogicalExpression(leftNode, true);
      } else if (leftNode.type === TSESTree.AST_NODE_TYPES.Identifier) {
        const errorId = checkIdentifier(leftNode);
        if (errorId) {
          context.report({
            node: expressionNode.left,
            messageId: errorId,
            fix: (fixer) => fixer.insertTextBefore(expressionNode.left, "!!"),
          });
        }
      }

      if (checkRightNode) {
        let rightNode = expressionNode.right;
        if (
          rightNode.type === TSESTree.AST_NODE_TYPES.MemberExpression &&
          rightNode.property.type !== TSESTree.AST_NODE_TYPES.PrivateIdentifier
        ) {
          rightNode = rightNode.property;
        }

        if (rightNode.type === TSESTree.AST_NODE_TYPES.Identifier) {
          const errorId = checkIdentifier(rightNode);
          if (errorId) {
            context.report({
              node: expressionNode.right,
              messageId: errorId,
              fix: (fixer) =>
                fixer.insertTextBefore(expressionNode.right, "!!"),
            });
          }
        }
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
