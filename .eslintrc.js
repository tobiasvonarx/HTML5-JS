module.exports = {
    "env": {
        "browser": true
    },
    "extends": [
        "eslint:recommended",
        "canvas"
    ],
    "rules": {
        "require-jsdoc": 0,
        "valid-jsdoc": 0,
        "no-console": 0,
        "max-len": 1,
        "one-var": 1,
        "prefer-const": 1,
        "one-var": 0,
        "id-length": 0,
        "max-params": 0,
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};