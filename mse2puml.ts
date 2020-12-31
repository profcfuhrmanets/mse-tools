import { generate } from "pegjs";
import * as fs from 'fs';

const grammar = fs.readFileSync('mse-famixjava.pegjs', 'utf-8');
const parser = generate(grammar);

const mseFileName = 'sample-famix-java-simple.mse';
let sampleMSE = fs.readFileSync(mseFileName, 'utf-8');

const mseJSON =  parser.parse(sampleMSE);

let classNameMap = new Map<string, string>();

let associationMap = new Map<string, string>();  // from id to id

// write out JSON for debugging
//fs.writeFileSync(mseFileName + '.json', JSON.stringify(mseJSON));

// map all the classnames to their ids
mseJSON.doc.forEach(element => classNameMap.set(element.id, element.element + element.id));

// generate plantuml
console.log ('@startuml\nskinparam style strictuml\n')
mseJSON.doc.forEach(element => {
    console.log(toPlantUML(element));
});

// create associations
associationMap.forEach((toClassName:string, fromClassName: string) => 
    console.log(classNameMap.get(fromClassName) + "-->" + classNameMap.get(toClassName))
);

console.log ('@enduml')

function toPlantUML(element) {
    var plantUMLString:string = '';
    plantUMLString += 'object "' + element.element + '" as ' + element.element + element.id + ' {\n';
    plantUMLString += attrToPlantUML(element);
    plantUMLString += '}\n';
    return plantUMLString;
}

function attrToPlantUML(element) {
    var plantUMLString:string = '';
    element.attrs.forEach(attr => {
        switch (attr.attr) {
            // get references
            case 'parameterizableClass':
            case 'typeContainer':
            case 'element':
            case 'declaredType':
            case 'previous':
            case 'subclass':
            case 'superclass':
            case 'parentNamespace':
                // association from element.id to reference
                associationMap.set(element.id, attr.vals[0].ref)
                //plantUMLString += attr.attr + '=' + classNameMap.get(attr.vals[0].ref) + '\n';
                break;
        
            default:
                plantUMLString += attr.attr + '=' + attr.vals[0] + '\n'
                break;
        }
    });
    return plantUMLString;
}