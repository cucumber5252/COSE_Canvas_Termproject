// model/ShapeFactory.js
export class ShapeFactory {
    static createShape(type, x, y, color) {
        switch (type) {
            case 'circle':
                return new Circle(x, y, color);
            case 'rectangle':
                return new Rectangle(x, y, color);
            case 'triangle':
                return new Triangle(x, y, color);
            default:
                throw new Error(`Unknown shape type: ${type}`);
        }
    }
}

export class Shape {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

export class Circle extends Shape {
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, 20, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
    }
}

export class Rectangle extends Shape {
    draw(context) {
        context.beginPath();
        context.rect(this.x - 20, this.y - 20, 40, 40);
        context.fill();
        context.stroke();
    }
}

export class Triangle extends Shape {
    draw(context) {
        context.beginPath();
        context.moveTo(this.x, this.y - 20);
        context.lineTo(this.x - 20, this.y + 20);
        context.lineTo(this.x + 20, this.y + 20);
        context.closePath();
        context.fill();
        context.stroke();
    }
}
