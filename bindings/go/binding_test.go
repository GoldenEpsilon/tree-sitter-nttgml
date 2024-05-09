package tree_sitter_gml_treesitter_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-gml_treesitter"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_gml_treesitter.Language())
	if language == nil {
		t.Errorf("Error loading GmlTreesitter grammar")
	}
}
