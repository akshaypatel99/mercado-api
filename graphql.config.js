module.exports = {
	projects: {
		app: {
			schema: ['.src/graphql/typedefs/schema.graphql'],
			documents: ['**/*.{graphql,js,ts,jsx,tsx}'],
		},
	},
};
