module.exports = {
    'disallow-buffer-from-alloc': {
        meta: {
            type: 'problem', // Define the rule type
            docs: {
                description: 'Disallow usage of Buffer.from',
                category: 'Best Practices',
                recommended: false
            },
            schema: [], // No options for this rule
            messages: {
                avoidBufferFrom:
                    'Using Buffer.from is not allowed, please use Uint8Array.from or HexUint.of.bytes instead.',
                avoidBufferAlloc:
                    'Using Buffer.alloc is not allowed, please use Uint8Array methods instead.'
            }
        },
        create(context) {
            return {
                CallExpression(node) {
                    const callee = node.callee;
                    if (
                        callee.type === 'MemberExpression' && // Check if it's a member expression
                        callee.object.name === 'Buffer' // Ensure it's `Buffer`
                    ) {
                        if (callee.property.name === 'from') {
                            // Ensure it's calling `from`)
                            context.report({
                                node,
                                messageId: 'avoidBufferFrom'
                            });
                        } else if (callee.property.name === 'alloc') {
                            // Ensure it's calling `from`)
                            context.report({
                                node,
                                messageId: 'avoidBufferAlloc'
                            });
                        }
                    }
                }
            };
        }
    },
    'disallow-instanceof-uint8array': {
        meta: {
            type: 'problem', // Define the rule type
            docs: {
                description: 'Disallow usage of instanceof Uint8Array',
                category: 'Best Practices',
                recommended: false
            },
            schema: [], // No options for this rule
            messages: {
                avoidInstanceOfUint8Array:
                    'Please review if you can avoid using instanceof Uint8Array. If not, please use ArrayBuffer.isView instead.'
            }
        },
        create(context) {
            return {
                BinaryExpression(node) {
                    // Check if it's an instanceof expression
                    if (
                        node.operator === 'instanceof' &&
                        node.right.type === 'Identifier' &&
                        node.right.name === 'Uint8Array'
                    ) {
                        context.report({
                            node,
                            messageId: 'avoidInstanceOfUint8Array'
                        });
                    }
                }
            };
        }
    }
};
