module.exports = { 
    'disallow-buffer-from': {
        meta: {
            type: 'problem', // Define the rule type
            docs: {
                description: 'Disallow usage of Buffer.from',
                category: 'Best Practices',
                recommended: false
            },
            schema: [], // No options for this rule
            messages: {
                avoidBufferFrom: 'Using Buffer.from is not allowed, please use Uint8Array.from or HexUint.of instead.'
            }
        },
        create(context) {
            return {
                CallExpression(node) {
                    const callee = node.callee;
                    if (
                        callee.type === 'MemberExpression' && // Check if it's a member expression
                        callee.object.name === 'Buffer' && // Ensure it's `Buffer`
                        callee.property.name === 'from' // Ensure it's calling `from`
                    ) {
                        context.report({
                            node,
                            messageId: 'avoidBufferFrom'
                        });
                    }
                }
            };
        }
    }
};
