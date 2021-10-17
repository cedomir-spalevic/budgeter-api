module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": "eslint:recommended",
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
      "no-unused-vars": "off"
	},
   "globals": {
      "process": "readonly",
      "test": "readonly",
      "describe": "readonly",
      "expect": "readonly",
      "beforeEach": "readonly"
   }
};
