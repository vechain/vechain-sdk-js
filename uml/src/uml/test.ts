// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Class0 {
    property: string = 'value';

    method(): string {
        return this.property;
    }
}

class Class1 {
    class0: Class0 = new Class0();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Class2 extends Class1 {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(class1: Class1) {
        super();
    }
}
