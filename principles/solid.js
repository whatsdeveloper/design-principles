/**
 * Code examples of the S.O.L.I.D
 */

const shapeInterface = state => ({
  type: 'shapeInterface',
  area: () => state.area(state)
});

const solidShapeInterface = state => ({
  type: 'solidShapeInterface',
  volume: () => state.volume(state)
});

const manageShapeInterface = fn => ({
  type: 'manageShapeInterface',
  calculate: () => fn()
});

const square = length => {
  const proto = {
    length,
    type: 'Square',
    area: args => Math.pow(args.length, 2)
  };
  const basics = shapeInterface(proto);
  const abstraccion = manageShapeInterface(() => basics.area());
  const composite = Object.assign({}, basics, abstraccion);
  return Object.assign(Object.create(composite), { length });
};

const circle = radius => {
  const proto = {
    radius,
    type: 'Circle',
    area: args => Math.PI * Math.pow(args.radius, 2)
  };

  const basics = shapeInterface(proto);
  const abstraccion = manageShapeInterface(() => basics.area());
  const composite = Object.assign({}, basics, abstraccion);
  return Object.assign(Object.create(composite), { radius });
};

const cubo = length => {
  const proto = {
    length,
    type: 'Cubo',
    area: args => Math.pow(args.length, 2),
    volume: args => Math.pow(args.length, 3)
  };
  const basics = shapeInterface(proto);
  const complex = solidShapeInterface(proto);
  const abstraccion = manageShapeInterface(
    () => basics.area() + complex.volume()
  );
  const composite = Object.assign({}, basics, abstraccion);
  return Object.assign(Object.create(composite), { length });
};

const areaCalculator = s => {
  const proto = {
    type: 'areaCalculator',
    sum() {
      const area = [];
      for (shape of this.shapes) {
        area.push(shape.calculate());
      }
      return area.reduce((v, c) => (c += v), 0);
    }
  };

  return Object.assign(Object.create(proto), { shapes: s });
};

const volumeCalculator = s => {
  const proto = {
    type: 'volumeCalculator'
  };
  const areaCalProto = Object.getPrototypeOf(areaCalculator());
  const inherit = Object.assign({}, areaCalProto, proto);
  return Object.assign(Object.create(inherit), { shapes: s });
};

const sumCalculatorOputter = a => {
  const proto = {
    JSON() {
      return JSON.stringify(this.calculator.sum());
    },
    HAML() {
      return `HAML format output`;
    },
    HTML() {
      return `
          <h1>
            Sum of the areas of provided shapes:
            ${this.calculator.sum()}
          </h1>`;
    },
    JADE() {
      return `JADE format output`;
    }
  };
  return Object.assign(Object.create(proto), { calculator: a });
};

const shapes = [circle(2), square(5), square(6)];

const solids = [cubo(4)];

const areas = areaCalculator(shapes);
const volume = volumeCalculator(solids);

const output = sumCalculatorOputter(areas);
const output2 = sumCalculatorOputter(volume);

console.log(output.JSON());
console.log(output.HAML());
console.log(output.HTML());
console.log(output2.HTML());
console.log(output.JADE());
