import { generate } from "pegjs";
import * as fs from 'fs';
import { MSEDocument, Element, Attr } from "./src/MSEDocument";

const INHERITANCE_LINK_COLOR = '#orange';
interface Association {
    from:string; 
    to:string;
    name:string;
}

const grammar = fs.readFileSync('mse-famixjava.pegjs', 'utf-8');
const parser = generate(grammar);

const mseFileName = 'sample-famix-java-simple.mse';
let sampleMSE = fs.readFileSync(mseFileName, 'utf-8');
const mseJSON:MSEDocument =  new MSEDocument(parser.parse(sampleMSE));

let classNameMap = new Map<string, string>();
let associations = new Array<Association>();

// write out JSON for debugging
//fs.writeFileSync(mseFileName + '.json', JSON.stringify(mseJSON));

// map all the classnames to their ids
mseJSON.nodes.forEach(element => {
    // Map has id as key and unique (plantuml) class name
    classNameMap.set(element.id, uniqueElementName(element));
    if (element.name == 'Inheritance') {
        // special case association
        let subclass = refForAttr(element, 'subclass');
        let superclass = refForAttr(element, 'superclass');
        associations.push({from: subclass, to: superclass, name: uniqueElementName(element)})
    }
});

// generate plantuml
console.log('@startuml');
console.log('skinparam style strictuml');
console.log('title Object diagram for ' + mseFileName + '\n');
console.log('!include note-with-source.puml');
mseJSON.nodes.forEach(element => {
    console.log(toPlantUML(element));
});

// create associations
associations.forEach(association => {
    // Inheritance is a special case - show it in UML even though it doesn't make 100% sense in object diagrams
    const isInheritance = association.name.startsWith('Inheritance');
    if (isInheritance) {
        console.log(`${classNameMap.get(association.from)} --|> ${classNameMap.get(association.to)} #line:blue`);
        console.log(`${classNameMap.get(association.from)} .[${INHERITANCE_LINK_COLOR}]. ${association.name}`);
        console.log(`${classNameMap.get(association.to)} .[${INHERITANCE_LINK_COLOR}]. ${association.name}`);
    } else {
        console.log(`${classNameMap.get(association.from)} ..> "${association.name}" ${classNameMap.get(association.to)}`);
    }
});

console.log ('@enduml')

function uniqueElementName(element: Element): string {
    return element.name + element.id;
}

function toPlantUML(element: Element) {
    let plantUMLString: string = '';
    let optionalName: string = element.getFirstValueForAttr('name');
    if (optionalName != '') optionalName = ' ' + optionalName + ' ';
    plantUMLString += 'object ":' + element.name + optionalName + '" as ' + uniqueElementName(element) + ' {\n';
    plantUMLString += 'id=' + element.id + '\n';
    plantUMLString += attrToPlantUML(element);
    plantUMLString += '}\n';
    return plantUMLString;
}

function attrToPlantUML(element:Element) {
    var plantUMLString:string = '';
    element.attrs.forEach(attr => {
        switch (attr.name) {
            // get references
            case 'parameterizableClass':
            case 'typeContainer':
            case 'element':
            case 'declaredType':
            case 'previous':
            case 'parentNamespace':
            case 'accessor':
            case 'variable':
            case 'parentType':
            case 'parentBehaviouralEntity':
                // association from element.id to reference
                //associationMap.set(element.id, attr.vals[0].ref)
                associations.push({from:element.id, to:attr.vals[0].ref, name:attr.name});
                //plantUMLString += attr.name + '=' + classNameMap.get(attr.vals[0].ref) + '\n';
                break;
            // ignore these associations
            case 'subclass':
            case 'superclass':
                break;
                
            default:
                plantUMLString += attr.name + '=' + attr.vals[0] + '\n'
                break;
        }
    });
    return plantUMLString;
}

function refForAttr(element:Element, attrKey:string):string {
    return element.attrs.filter(attr => attr.name == attrKey)[0].vals[0].ref;
}