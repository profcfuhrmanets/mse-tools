// MSE types
// These will change if the JSON from the PEG.js grammar changes, but not automatically
// It helps with code completion in VSCode

export class MSEDocument {
    nodes: Element[]
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
    name: string
    vals: any[]
}
  