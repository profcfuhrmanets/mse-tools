// MSE types
// These will change if the JSON from the PEG.js grammar changes, but not automatically
// It helps with code completion in VSCode

export class MSEDocument {
    nodes: Element[]

    // take raw JSON and transform it
    constructor(jsonNodes: any) {
        this.nodes = new Array<Element>();
        jsonNodes.nodes.forEach(jsonElement => this.nodes.push(new Element(jsonElement)));
    }

    public static readonly OPEN_TOKEN = "(";
    public static readonly CLOSE_TOKEN = ")";
    public toMSE(): string {
        let result:string = '';
        result += MSEDocument.OPEN_TOKEN;
        this.nodes.forEach(node => result += node.toMSE());
        result += MSEDocument.CLOSE_TOKEN;
        return result;
    }
}

export class Element {
    name: string
    id?: string
    attrs: Attr[]

    constructor(jsonElement:any) {
        this.name = jsonElement.name;
        this.id = jsonElement.id;
        this.attrs = new Array<Attr>();
        jsonElement.attrs.forEach(attr => this.attrs.push(new Attr(attr)));
    }

    getFirstValueForAttr(attrToFind: string): string {
        let result:Array<Attr> = this.attrs.filter(attr => attr.name == attrToFind);
        if (result.length == 1) return result[0].vals[0];
        return '';
    }
    public toMSE():string {
        let result:string = '';
        if (this.id) { 
            result += MSEDocument.OPEN_TOKEN + 'id: ' + this.id + MSEDocument.CLOSE_TOKEN + '\n'
        };
        result += MSEDocument.OPEN_TOKEN + 'name: ' + this.name + MSEDocument.CLOSE_TOKEN + '\n'
//        this.attrs.forEach(attr => result += attr.toMSE());
        return result;
    };
}

export class Attr {
    name: string;
    vals: any[];

    constructor(jsonAttr:any) {
        this.name = jsonAttr.name;
        this.vals = new Array<any>();
        jsonAttr.vals.forEach(val => this.vals.push(val));
    }
}
  