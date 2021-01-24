# mse-tools
 Tools to manipulate MSE files

```bash
$ ts-node mse2puml.ts > testoutput.puml
```

Sample PlantUML from an MSE for a simple Java file:

![Object diagram for sample-famix-java-simple.mse](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/profcfuhrmanets/mse-tools/main/testoutput.puml&fmt=svg "Object diagram for sample-famix-java-simple.mse")

To load an MSE like this one in Moose (Pharo), one must use:

```smalltalk
model := FamixJavaModel  importFromMSEStream: './sample-famix-java-simple-class-method.mse' asFileReference readStream.
```