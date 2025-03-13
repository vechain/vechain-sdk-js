// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Interface0 {
    method: (s: string) => string[];
}

class Class0 {
    property: string = 'value';

    method0(): string {
        return this.property;
    }
}

class Class1 implements Interface0 {
    class0: Class0 = new Class0();

    method(s: string): string[] {
        return [s];
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Class2 extends Class1 {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(class1: Class1) {
        super();
    }
}
