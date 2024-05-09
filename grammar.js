/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "NTT_GML",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => seq(optional($.block), repeat($._definition)),

    _definition: ($) => choice($.function_definition, $.macro_definition),

    function_definition: ($) =>
      seq(
        "#define",
        $.identifier,
        optional($.parameter_list),
        optional($.block),
      ),

    macro_definition: ($) =>
      seq("#macro", $.identifier, optional($.parameter_list), $.block),

    parameter_list: ($) => seq("(", repeat(choice(",", $.identifier)), ")"),

    argument_list: ($) => seq("(", repeat(choice(",", $._expression)), ")"),

    block: ($) => prec.right(0, repeat1($._statement)),

    _statement: ($) =>
      choice(
        seq("{", $.block, "}"),
        prec(
          1,
          seq(
            choice("if", "with", "repeat", "while"),
            optional("("),
            $._expression,
            optional(")"),
            $._statement,
          ),
        ),
        prec(
          1,
          seq(
            choice("for"),
            optional("("),
            optional($.asgn_statement),
            ";",
            $._expression,
            ";",
            optional($.asgn_statement),
            optional(")"),
            $._statement,
          ),
        ),
        seq($.function_call, optional($.semicolon)),
        $.return_statement,
        $.asgn_statement,
      ),

    return_statement: ($) =>
      seq("return", $._expression, optional($.semicolon)),

    function_call: ($) => seq($.identifier, $.argument_list),

    asgn_statement: ($) =>
      seq(
        optional("var"),
        $.identifier,
        $.asgn,
        $._expression,
        optional($.semicolon),
      ),

    _expression: ($) =>
      prec.right(
        0,
        choice(
          seq("(", $._expression, ")"),
          seq("in", $.identifier),
          $.number,
          $.string,
          $.array,
          $.struct,
          prec.right(2, $.function_call),
          $.identifier,
          seq($.unary, $._expression),
          prec.left(2, seq($._expression, $.op, $._expression)),
        ),
      ),

    array: ($) => seq("[", repeat(choice($._expression, ",")), "]"),

    struct: ($) =>
      seq("{", repeat(choice(seq($.identifier, ":", $._expression), ",")), "}"),

    asgn: ($) => choice("=", "+=", "-=", "/=", "*=", "%="),

    unary: ($) => choice("!", "not"),

    op: ($) =>
      choice(
        "==",
        ">=",
        "<=",
        "!=",
        ">",
        "<",
        "and",
        "not",
        "or",
        "&&",
        "||",
        "+",
        "-",
        "*",
        "/",
        "%",
        "?",
        ":",
      ),

    identifier: ($) => /[a-zA-Z_]+[a-zA-Z0-9_.]*/,

    number: ($) => /-?(([0-9]*\.)?[0-9]+)/,

    string: ($) => choice(/".*"/, /''.*'/, /`.*`/),

    semicolon: ($) => /;/,

    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
  extras: ($) => [$.comment, /[\s\p{Zs}\uFEFF\u2028\u2029\u2060\u200B]/],
});
