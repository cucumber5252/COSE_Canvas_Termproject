// class ShapeFactory {
//   static createShape(type, properties) {
//     switch (type) {
//       case "circle":
//         return new Circle(properties);
//       case "rectangle":
//         return new Rectangle(properties);
//       default:
//         throw new Error("Unsupported shape type");
//     }
//   }
// }

// class Circle {
//   constructor({ x, y, radius }) {
//     this.x = x;
//     this.y = y;
//     this.radius = radius;
//   }

//   draw(context) {
//     context.beginPath();
//     context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
//     context.stroke();
//   }
// }

// class Rectangle {
//   constructor({ x, y, width, height }) {
//     this.x = x;
//     this.y = y;
//     this.width = width;
//     this.height = height;
//   }

//   draw(context) {
//     context.beginPath();
//     context.rect(this.x, this.y, this.width, this.height);
//     context.stroke();
//   }
// }

// export default ShapeFactory;
