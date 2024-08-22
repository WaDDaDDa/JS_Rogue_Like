import chalk from "chalk";
import readlineSync from "readline-sync";
import figlet from "figlet";

class Player {
  constructor() {
    this._hp = 150; // 체력
    this._att = 25; // 공격력
    this._crt = 30; //크리확률
    this._crtdmg = 1.5; // 크리대미지 배율
    this._escape = 100; // 도망확률 20퍼 시작.

    this._damagerate = 1.0; //받는 피해 배율
    this._doubleAttackRate = 50; // 더블어택 성공확률
    this._dodge = 60; // 회피율
    this._dodgeAttack = 50; // 회피 반격 확률  반드시 치명타.
    this._stageLevel = 0;

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

  get doubleAttackRate() {
    return this._doubleAttackRate;
  }

  get dodge() {
    return this._dodge;
  }

  get dodgeAttack() {
    return this._dodgeAttack;
  }

  get stageLevel() {
    return this._stageLevel;
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

  set doubleAttackRate(n) {
    this._doubleAttackRate = n;
  }

  set dodge(n) {
    this._dodge = n;
  }

  set dodgeAttack(n) {
    this._dodgeAttack = n;
  }

  set stageLevel(n) {
    this._stageLevel = n;
  }

  // act
  resetState() {
    this._state = "";
  }

  attack(monster, logs) {
    // 플레이어의 공격
    this.state = "";
    const randomInt = Math.floor(Math.random() * 100) + 1;
    let damage = 0;

    if (monster.dodgeCheck()) {
      // 회피성공하면 몬스터 피해 X
      logs.push(chalk.red(`앗..! 몬스터가 공격을 회피했다!!\n`));
      logs.push(
        chalk.red(`Boss : 날 이때까지의 애송이들과 같다고 생각하지 마라...\n`)
      );
    } else {
      // 몬스터 회피 실패
      if (randomInt <= this.crt) {
        this.state = "Critical Hit";
        damage = parseInt(this.att * this.crtdmg);
        monster.hp -= damage;
      } else {
        monster.setterhp;
        damage = this.att;
        monster.hp -= damage;
      }

      logs.push(chalk.red(`몬스터에게 ${damage}만큼의 피해를 주었습니다.\n`));
    }

    if (monster.hp > 0) {
      monster.attack(this, logs);
    }
  }

  doubleAttack(monster, logs) {
    // 플레이어의 더블 공격
    let randomInt = Math.floor(Math.random() * 100) + 1;
    this.state = "";
    // 60퍼 확률로 실패
    if (randomInt <= 100 - this.doubleAttackRate) {
      this.state = "DoubleAttack Fail";
      logs.push(
        chalk.red(
          `앗! 긴장한 나머지 손이 미끄러졌다... 더블 어택 사용에 실패했다!!\n`
        )
      );

      monster.attack(this, logs);
      return;
    }

    // 성공

    let damage = 0;
    this.state = "Double Attack!!";

    if (monster.dodgeCheck()) {
      // 회피성공하면 몬스터 피해 X
      logs.push(chalk.red(`앗..! 몬스터가 공격을 회피했다!!\n`));
      logs.push(
        chalk.red(`Boss : 날 이때까지의 애송이들과 같다고 생각하지 마라...\n`)
      );
    } else {
      // 몬스터 회피 실패
      for (let i = 0; i < 2; i++) {
        randomInt = Math.floor(Math.random() * 100) + 1;

        if (randomInt <= this.crt) {
          this.state = "Critical Hit";
          damage = parseInt(this.att * this.crtdmg);
          monster.hp -= damage;
        } else {
          monster.setterhp;
          damage = this.att;
          monster.hp -= damage;
        }

        logs.push(chalk.red(`몬스터에게 ${damage}만큼의 피해를 주었습니다.\n`));
      }
    }

    if (monster.hp > 0) {
      monster.attack(this, logs);
    }
  }

  dodgeCheck(monster, logs) {
    // 플레이어의 공격
    this.state = "";
    let randomInt = Math.floor(Math.random() * 100) + 1;

    let damage = 0;

    // 회피 성공
    if (randomInt <= this.dodge) {
      this.state = "Dodge";

      logs.push(chalk.green(`플레이어가 회피에 성공했습니다!!\n`));
      logs.push(chalk.green(`${this.dodgeAttack}% 확률로 회피 반격 합니다.\n`));

      randomInt = Math.floor(Math.random() * 100) + 1;
      // 회피반격 성공
      if (randomInt <= this.dodgeAttack) {
        this.state = "Counter!!";
        damage = parseInt(this.att * this.crtdmg);
        monster.hp -= damage;
        logs.push(
          chalk.green(
            `회피 반격에 성공하여 몬스터에게 ${damage}만큼의 피해를 주었습니다.\n`
          )
        );
      } else {
        logs.push(chalk.red(`회피 반격 실패.\n`));
      }
    } else {
      logs.push(
        chalk.red(`플레이어가 회피에 실패하여 더 큰 대미지를 입습니다.\n`)
      );
      this.damagerate = 1.5;
      this.state = "Dodge Fail!!";
      monster.attack(this, logs);
    }
  }

  escapecheck(monster, logs) {
    const randomInt = Math.floor(Math.random() * 100) + 1;

    if (randomInt <= this.escape) {
      this.state = "Escape Success";
      this.escape = 100; // 도주 성공하면 초기화;
      logs.push(chalk.green(`플레이어가 도주에 성공했습니다.\n`));
    } else {
      this.state = "Escape Fail";
      this.damagerate = 1.5;
      this.escape += 5; // 도주 확률 증가.

      logs.push(
        chalk.red(`플레이어가 도주에 실패하여 더 큰 대미지를 입습니다.\n`)
      );

      monster.attack(this, logs);
    }
  }

  randomStatUp() {
    const randomInt = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    let stat = 0;
    switch (randomInt) {
      case 1:
      case 2:
        stat = Math.floor(Math.random() * (40 - 30 + 1)) + 30; // hp 30 ~ 40
        console.log(chalk.green(`체력이 ${stat}만큼 상승하였습니다!!`));
        this.hp += stat;
        break;
      case 3:
        stat = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // att 8 ~ 15
        console.log(chalk.green(`공격력이 ${stat}만큼 상승하였습니다!!`));
        this.att += stat;
        break;
      case 4:
        stat = Math.floor(Math.random() * (15 - 10 + 1)) + 10; // 크리확률 10 ~ 15
        console.log(chalk.green(`치명타 확률이 ${stat}만큼 상승하였습니다!!`));
        this.crt += stat;
        break;
      case 5:
        stat = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 치명타 배율 10 ~ 20
        console.log(
          chalk.green(`치명타 배율이 ${stat / 10}만큼 상승하였습니다!!`)
        );
        this.crtdmg += stat / 10;
        break;
      case 6:
        stat = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 도망확률 10 ~ 20
        console.log(
          chalk.green(`다음 도망에 성공할 확률이 ${stat}%만큼 상승하였습니다!!`)
        );
        this.escape += stat;
        break;
      case 7:
        stat = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // 더블어택 5 ~ 15
        console.log(
          chalk.green(`더블 어택에 성공할 확률이 ${stat}%만큼 상승하였습니다!!`)
        );
        this.doubleAttackRate += stat;
        break;
      case 8:
        stat = Math.floor(Math.random() * (15 - 10 + 1)) + 10; // 회피 10 ~ 15
        console.log(
          chalk.green(`회피에 성공할 확률이 ${stat}%만큼 상승하였습니다!!`)
        );
        this.dodge += stat;
        break;
      case 9:
        stat = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 회피반격 10 ~ 20
        console.log(
          chalk.green(`회피반격에 성공할 확률이 ${stat}%만큼 상승하였습니다!!`)
        );
        this.dodgeAttack += stat;
        break;
      default:
        console.log(chalk.red(`꽝...!!`));
        break;
    }
  }
}

class Monster {
  constructor(stage) {
    // 스테이지레벨 만큼 능력치상승 랜덤으로 반복
    this.hp = 100 + 100 * 0.1 * stage.level;
    this.att = 10 + 10 * 0.1 * stage.level;
    let randomCount = 0;
    for (let i = 0; i < stage.level; i++) {
      randomCount = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
      switch (randomCount) {
        case 1:
          this.hp *= 1.1;
          break;
        case 2:
          this.att *= 1.1;
          break;
      }
    }

    this.hp = parseInt(this.hp);
    this.att = parseInt(this.att);
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
    let damage = parseInt(this.att * player.damagerate);
    player.hp -= damage;
    player.damagerate = 1;
    logs.push(chalk.red(`플레이어가 ${damage}만큼의 피해를 받았습니다.`));
    if (player.hp < 0) {
      player.state = "You Die";
    }

    return damage;
  }

  dodgeCheck() {
    return false;
  }
}

// 보스 몬스터
class BossMonster extends Monster {
  constructor(stage) {
    super(stage);
  }

  dodgeCheck() {
    const randomInt = Math.floor(Math.random() * 100) + 1;

    // 회피확률 20퍼
    if (randomInt <= 20) {
      return true;
    }

    return false;
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
    case "DoubleAttack Fail":
      redFigletLog(player.state);
      break;
    case "Double Attack!!":
      greenFigletLog(player.state);
      break;
    case "Dodge":
      greenFigletLog(player.state);
      break;
    case "Counter!!":
      greenFigletLog(player.state);
      break;
    case "Dodge Fail!!":
      redFigletLog(player.state);
      break;
    case "You Die":
      redFigletLog(player.state);
      break;
    case "Boss Monster":
      redFigletLog(player.state);
      break;
    default:
      if (player.stageLevel === 10) {
        redFigletLog("Boss Monster");
      } else {
        redFigletLog("Monster");
      }
      break;
  }
}

async function waitInput() {
  readlineSync.question("다음으로.");
}

function displayStatus(stage, player, monster) {
  playerStateLog(player);

  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage.level} `) +
      chalk.blueBright(
        `| 플레이어 정보 체력 : ${player.hp}, 공격력 : ${player.att}, 크리티컬 확률 : ${player.crt}, 크리티컬 대미지 : ${player.crtdmg}배 `
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
        chalk.redBright(`플레이어가 사망했습니다. 게임을 종료합니다.`)
      );
      await waitInput();
      return;
    }

    // 몬스터 사망, 도망 성공 == 스테이지 클리어
    if (player.state === "Escape Success" || monster.hp <= 0) {
      if (stage.level === 10) {
        console.log(chalk.redBright(`Boss : 크으으아아악!!!\n`));
        console.log(chalk.redBright(`Boss : 크윽.. 내가.. 내가..!! 지다..니...\n`));
        await waitInput();
        console.log(chalk.greenBright(`보스를 쓰러트렸다!!\n`));
        console.log(chalk.greenBright(`스테이지 클리어!`));
        await waitInput();
        return;
      }

      // await으로 입력받을때까지 기다리기
      console.log(chalk.green(`스테이지 클리어!`));
      // 상태 리셋
      player.resetState();
      const healHp = parseInt(monster.att * 2.5);
      console.log(
        chalk.green(
          `몬스터를 처치하여 체력을 ${healHp}만큼 회복하고 랜덤 보상을 획득합니다.`
        )
      );
      player.hp += healHp;
      await waitInput();

      // 스탯 랜덤 증가. 체력회복
      player.randomStatUp();
      await waitInput();
      return;
    }

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 더블 어택(성공확률: ${player.doubleAttackRate}%) 3. 회피(성공확률 : ${player.dodge}%) 4. 도망친다(성공확률: ${player.escape}%) 5. 자살`
      )
    );
    const choice = readlineSync.question("당신의 선택은? ");

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.\n`));

    switch (choice) {
      case "1":
        player.attack(monster, logs);
        break;
      case "2":
        player.doubleAttack(monster, logs);
        break;
      case "3":
        player.dodgeCheck(monster, logs);
        break;
      case "4":
        player.escapecheck(monster, logs);
        break;
      case "5":
        // 종료
        stage.over = true;
        player.state = "You Die";
        logs.push(chalk.redBright(`플레이어가 공포에 질려 자살 했습니다.`));
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
    let monster = "";
    player.stageLevel = stage.level;

    if (stage.level === 10) {
      monster = new BossMonster(stage);
    } else {
      monster = new Monster(stage);
    }
    await battle(stage, player, monster);

    if (stage.over === true || player.hp <= 0) {
      process.exit(0);
    }
    // 스테이지 클리어 및 게임 종료 조건

    stage.level++;
  }

  greenFigletLog("Game Clear");
}
