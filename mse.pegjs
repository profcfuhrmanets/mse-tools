// Quick-and-dirty PEG.js grammar from EBNF published in https://www.researchgate.net/publication/265428652_MSE_and_FAMIX_30_an_Interexchange_Format_and_Source_Code_Model_Family
// Try it with https://pegjs.org/online
// Created by Christopher Fuhrman
Root = d:Document ? {return {nodes:d}}
Document = OPEN nodes:(ElementNode *) CLOSE {return nodes}
ElementNode = OPEN name:ELEMENTNAME id:Serial ? attrNodes:(AttributeNode *) CLOSE 
	{return {name:name, id:id, attrs:attrNodes}}
Serial = OPEN ID id:INTEGER CLOSE {return id}
AttributeNode = OPEN n:SIMPLENAME vals:(ValueNode *) CLOSE {return {name:n, vals:vals } }
ValueNode = Primitive / Reference / ElementNode
Primitive = STRING / NUMBER / Boolean
Boolean = TRUE / FALSE
Reference = IntegerReference / NameReference / TypeReference
IntegerReference = OPEN REF i:INTEGER CLOSE {return {ref:i}}
NameReference = OPEN REF e:ELEMENTNAME CLOSE {return {ref:e}}
TypeReference = OPEN REF t:TYPENAME CLOSE {return {ref:t}}
OPEN = _ "(" _ 
CLOSE = _ ")" _
ID = _ t:"id:" _ {return t}
REF = _ t:"ref:" _ {return t}
TRUE = _ t:"true" _ {return t}
FALSE = _ t:"false" _ {return t} 
ELEMENTNAME "ElementName" = _ letter ( letter / digit ) * ( "." letter ( letter / digit ) * ) _  {return text().trim()}
SIMPLENAME "Simplename" = _ letter ( letter / digit ) * _  {return text().trim()}
TYPENAME "Typename" = 'Object' / 'Character' / 'Number' / 'Fraction' / 'String' / 'Symbol' / 'Boolean' 
INTEGER "Integer" = _ digit + _ {return text().trim()}
NUMBER = _ "-" ? digit + ( "." digit + ) ? ( ( "e" / "E" ) ( "-" / "+" ) ? digit + ) ? _ {return text().trim()}
STRING = _ ( "\'" [^'] * "\'" ) + _ {return text().trim()}
letter = [A-Za-z]
digit = [0-9]
_ = space*
space "whitespace" = [ \t\n\r]
