////command/Command.js////
//모든 커맨드 클래스는 이 클래스를 상속 받아서, 실행과 취소를 구현한다.

export class Command {
  //명령 실행
  execute() {}
  //명령 취소
  undo() {}
}
