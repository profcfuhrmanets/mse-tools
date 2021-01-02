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
const mseJSON:MSEDocument =  new MSEDocument(parser.parse(sampleMSE), 'Famix-Java-Entities.');

// test the serialization
console.log(mseJSON.toMSE());