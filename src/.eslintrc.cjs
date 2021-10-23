module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
      "jest/globals": true
	},
   "plugins": ["jest"],
	"extends": ["eslint:recommended"],
	"parserOptions": {
		"ecmaVersion": 13,
		"sourceType": "module"
	},
	"rules": {
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
      "no-unused-vars": "off",
      "jest/consistent-test-it": [
         "error",
         {
            "fn": "test"
         }
      ]
	},
   "globals": {
      "process": "readonly"
   }
};
