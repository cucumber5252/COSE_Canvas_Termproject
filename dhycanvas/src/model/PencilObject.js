export class PencilObject {
  constructor(points = []) {
    this.points = points; //점들의 배열 저장
    this.tool = "pencil"; // tool 속성을 추가하여 펜슬로 그린 것임을 표시합니다.
  }

  //점 추가
  addPoint(point) {
    this.points.push(point);
  }

  //객체 그리는 메서드
  draw(context) {
    context.beginPath();
    this.points.forEach((point, index) => {
      if (index === 0) {
        context.moveTo(point.x, point.y);
      } else {
        context.lineTo(point.x, point.y);
      }
    });
    context.stroke();
  }
}
