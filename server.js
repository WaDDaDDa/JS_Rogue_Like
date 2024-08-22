import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { startGame } from "./game.js";

// 로비 화면을 출력하는 함수
function displayLobby() {
  console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.cyan(
      figlet.textSync("JS-Like", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  // 상단 경계선
  const line = chalk.magentaBright("=".repeat(50));
  console.log(line);

  // 게임 이름
  console.log(chalk.yellowBright.bold("CLI 게임에 오신것을 환영합니다!"));

  // 설명 텍스트
  console.log(chalk.green("옵션을 선택해주세요."));
  console.log();

  // 옵션들
  console.log(chalk.blue("1.") + chalk.white(" 새로운 게임 시작"));
  console.log(chalk.blue("2.") + chalk.white(" 게임 설명"));
  console.log(chalk.blue("3.") + chalk.white(" 제작자"));
  console.log(chalk.blue("4.") + chalk.white(" 종료"));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray("1-4 사이의 수를 입력한 뒤 엔터를 누르세요."));
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  const choice = readlineSync.question("입력: ");

  switch (choice) {
    case "1":
      console.log(chalk.green("게임을 시작합니다."));
      // 여기에서 새로운 게임 시작 로직을 구현
      startGame();
      break;
    case "2":
      console.log(
        chalk.yellow(`
스테이지를 끝까지 클리어해 주세요.

플레이어 행동
1. 일반 공격 : 100퍼센트 성공하는 일반공격입니다. Player의 공격력만큼 대미지를 줄 수 있으며, 크리티컬 확률에 따라 크리티컬 대미지 만큼의 더 강한 피해를 입힐 수 있습니다.
2. 연속 공격 : 2번 연속 공격을 시도합니다. 성공확률이 표기 되어 있으며 성공하면 적을 2번 연속으로 때릴 수 있습니다. 각 공격에는 각 치명타 확률이 적용됩니다. 실패하면 공격을 할 수 없습니다.
3. 회피 : 몬스터의 공격을 일정 확률로 회피하여 대미지를 입지 않습니다. 회피에 성공하고 나면 회피 반격을 할 수 있으며 회피 반격에 성공하면 항상 치명타로 터지는 회피공격을 실시합니다.
4. 도망 : 도망에 성공하면 해당 스테이지를 클리어 합니다. 도망에 실패하면 다음번 도망성공 확률이 5% 상승 합니다.
5. 자살 : 절망적인 상황에서 편해질 수 있습니다.

회피와 도망에 실패하게 되면 몬스터에게 받는 피해가 더 크게 증게합니다. 신중하게 사용하세요.

플레이어 스탯
1. Hp : 체력입니다. 0보다 아래로 떨어지면 사망하고 게임이 종료됩니다.
2. Att : 공격력입니다. 
3. 크리티컬 확률 : 치명타 공격을 가하는 확률입니다.
4. 크리티컬 배율 : 치명타 공격에 성공했을때 공격력x배율 만큼의 치명적인 대미지를 입힐 수 있습니다.
5. 회피율 : 회피에 성공할 확률입니다.
6. 회피반격율 : 회피이후 회피반격에 성공할 확률입니다.
7. 연속공격 확률 : 연속공격에 성공할 확률입니다.
8. 도망 확률 : 도망에 성공할 확률입니다.
9. 꽝..! : 꽝! 

스테이지를 클리어하게 되면 일정 체력을 회복하고 위의 스탯중 랜덤한 스탯이 오르게 됩니다.`)
      );
      // 업적 확인하기 로직을 구현
      handleUserInput();
      break;
    case "3":
        console.log(
            chalk.cyan(
              figlet.textSync("Kim Jun Young", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default",
              })
            )
          );
      // 옵션 메뉴 로직을 구현
      handleUserInput();
      break;
    case "4":
      console.log(chalk.red("게임을 종료합니다."));
      // 게임 종료 로직을 구현
      process.exit(0); // 게임 종료
      break;
    default:
      console.log(chalk.red("올바른 선택을 하세요."));
      handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
  }
}

// 게임 시작 함수
function start() {
  displayLobby();
  handleUserInput();
}

// 게임 실행
start();
