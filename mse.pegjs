// Quick-and-dirty PEG.js grammar from EBNF published in https://arxiv.org/abs/2011.10975
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
Reference = IntegerReference / NameReference
IntegerReference = OPEN REF i:INTEGER CLOSE {return {ref:i}}
NameReference = OPEN REF e:ELEMENTNAME CLOSE {return {ref:e}}
OPEN = _ "(" _ 
CLOSE = _ ")" _
ID = _ t:"id:" _ {return t}
REF = _ t:"ref:" _ {return t}
TRUE = _ t:"true" _ {return t}
FALSE = _ t:"false" _ {return t} 
ELEMENTNAME = _ letter ( letter / digit ) * ( "." letter ( letter / digit ) * ) _  {return text().trim()}
SIMPLENAME = _ letter ( letter / digit ) * _  {return text().trim()}
INTEGER = _ digit + _ {return text().trim()}
NUMBER = _ "-" ? digit + ( "." digit + ) ? ( ( "e" / "E" ) ( "-" / "+" ) ? digit + ) ? _ {return text().trim()}
STRING = _ ( "\'" [^'] * "\'" ) + _ {return text().trim()}
letter = [A-Za-z]
digit = [0-9]
_ = space*
space = [ \t\n\r]