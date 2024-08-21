import chalk from "chalk";
import readlineSync from "readline-sync";
import figlet from "figlet";

class Player {
  constructor() {
    this._hp = 100; // 체력
    this._att = 20; // 공격력
    this._crt = 20; //크리확률
    this._crtdmg = 1.5; // 크리대미지 배율
    this._escape = 5;   // 도망확률 5퍼 시작.

    this._damagerate = 1.0; //받는 피해 배율

    this._state = "";
  }

  // getter
  get hp() {
    return this._hp;
  }

  get att() {
    return this._att;
  }

  get crt() {
    return this._crt;
  }

  get crtdmg() {
    return this._crtdmg;
  }

  get state() {
    return this._state;
  }

  get escape() {
    return this._escape;
  }

  get damagerate() {
    return this._damagerate;
  }

  // setter
  set hp(n) {
    this._hp = n;
  }

  set att(n) {
    this._att = n;
  }

  set crt(n) {
    this._crt = n;
  }

  set crtdmg(n) {
    this._crtdmg = n;
  }

  set state(str) {
    this._state = str;
  }
  
  set escape(n) {
    this._escape = n;
  }

  set damagerate(n) {
    this._damagerate = n;
  }

  // act
  resetState(){
    this._state = "";
  }

  attack(monster, logs) {
    // 플레이어의 공격
    this.state = "";
    const randomInt = Math.floor(Math.random() * 100) + 1;
    let damage = 0;

    if (randomInt <= this.crt) {
      this.state = "Critical Hit";
      damage = this.att * this.crtdmg;
      monster.hp -= damage;
    } else {
      monster.setterhp;
      damage = this.att;
      monster.hp -= damage;
    }

    logs.push(chalk.red(`몬스터에게 ${damage}만큼의 피해를 주었습니다.\n`));
    if(monster.hp >= 0){
      monster.attack(this, logs);      
    }
  }


  escapecheck(monster, logs){
    const randomInt = Math.floor(Math.random() * 100) + 1;

    if(randomInt <= this.escape){
      this.state = "Escape Success";
      this.escape = 5; // 도주 성공하면 초기화;
      logs.push(chalk.green(`플레이어가 도주에 성공했습니다.\n`));
    }
    else{
      this.state = "Escape Fail";
      this.damagerate = 1.5;
      this.escape += 5; // 도주 확률 증가.

      logs.push(chalk.red(`플레이어가 도주에 실패하여 더 큰 대미지를 입습니다.\n`));

      monster.attack(this, logs);
    }
  }
}

class Monster {
  constructor() {
    this.hp = 100;
    this.att = 20;
  }

  // getter
  get hp() {
    return this._hp;
  }

  get att() {
    return this._att;
  }

  // setter
  set hp(n) {
    this._hp = n;
  }

  set att(n) {
    this._att = n;
  }

  attack(player, logs) {
    // 몬스터의 공격
    let damage = this.att * player.damagerate;
    player.hp -= damage;
    player.damagerate = 1;
    logs.push(chalk.red(`플레이어가 ${damage}만큼의 피해를 받았습니다.`));

    return damage;
  }
}

function redFigletLog(str) {
  console.log(
    chalk.redBright(
      figlet.textSync(str, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
}

function greenFigletLog(str) {
  console.log(
    chalk.greenBright(
      figlet.textSync(str, {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
}

function playerStateLog(player) {
  switch (player.state) {
    case "Critical Hit":
      redFigletLog(player.state);
      break;
    case "Escape Success":
      greenFigletLog(player.state);
      break;
    case "Escape Fail":
      redFigletLog(player.state);
      break;


    default:
      redFigletLog("Monster");
      break;
  }
}

async function waitInput() {
  readlineSync.question("엔터 누르세요.");
}

function displayStatus(stage, player, monster) {
  playerStateLog(player);

  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage.level} `) +
      chalk.blueBright(
        `| 플레이어 정보 체력 : ${player.hp}, 공격력 : ${player.att}, 크리티컬 확률 : ${player.crt}, 크리티컬 대미지 : ${player.crtdmg}`
      ) +
      chalk.redBright(
        `| 몬스터 정보 체력 : ${monster.hp}, 공격력 : ${monster.att}|`
      )
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (true) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));
    logs.length = 0;

    // 게임오버, 플레이어 사망 == 게임종료
    if (stage.over === true || player.hp <= 0) {
      // await으로 입력받을때까지 기다리기
      console.log(
        chalk.redBright(
          `플레이어가 사망했습니다. 게임을 종료합니다.`
        )
      );
      await waitInput();
      return;
    }

    // 몬스터 사망, 도망 성공 == 스테이지 클리어
    if (player.state === "Escape Success" || monster.hp <= 0) {
      // await으로 입력받을때까지 기다리기
      console.log(
        chalk.green(
          `스테이지 클리어!`
        )
      );
      // 상태 리셋 
      player.resetState();
      // 스탯 랜덤 증가. 체력회복

      await waitInput();
      return;
    }

    console.log(
      chalk.green(`\n1. 공격한다 2. 스킬 사용. 3. 도망친다(${player.escape}%), 4. 자살`)
    );
    const choice = readlineSync.question("당신의 선택은? ");

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.\n`));

    switch (choice) {
      case "1":
        player.attack(monster, logs);
        break;
      case "2":
        break;
      case "3":
        player.escapecheck(monster, logs);
        break;
      case "4":
        // 종료
        stage.over = true;
        logs.push(
          chalk.redBright(
            `플레이어가 공포에 질려 자살 했습니다.`
          )
        );
        break;
      default:
        logs.push(
          chalk.green(`${choice}유효하지 않은 선택입니다. 다시 선택해 주세요.`)
        );
        break;
    }

  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = { level: 1, over: false };

  while (stage.level <= 10) {
    const monster = new Monster(stage.level);
    await battle(stage, player, monster);

    if (stage.over === true || player.hp <= 0) {
      process.exit(0);
    }
    // 스테이지 클리어 및 게임 종료 조건

    stage.level++;
  }
}
