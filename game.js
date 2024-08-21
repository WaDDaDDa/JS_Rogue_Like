import chalk from 'chalk';
import readlineSync from 'readline-sync';
import figlet from 'figlet';

class Player {
  constructor() {
    this.hp = 100; // 체력
    this.att = 20; // 공격력
    this.crt = 20; //크리확률
    this.crtdmg = 1.5; // 크리대미지 배율

    this.crtbool = false;
  }

  attack(monster) {
    // 플레이어의 공격
    this.crtbool = false;
    if(Math.random(1, 100) <= this.crt){
      this.crtbool = true;
      monster.hp -= this.att * this.crtdmg;
    }
    else{
      monster.hp -= this.att;
    }
    
  }
}

class Monster {
  constructor() {
    this.hp = 100;
    this.att = 20;
  }

  attack() {
    // 몬스터의 공격
  }
}

function displayStatus(stage, player, monster) {
  if(player.crtbool === true){

    console.log(
      chalk.redBright(
          figlet.textSync('Critical Hit', {
              font: 'Standard',
              horizontalLayout: 'default',
              verticalLayout: 'default'
          })
      )
  );
  }
  else{
    console.log(
      chalk.redBright(
          figlet.textSync('Monster', {
              font: 'Standard',
              horizontalLayout: 'default',
              verticalLayout: 'default'
          })
      )
  );
  }
  

  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage.level} `) +
    chalk.blueBright(
      `| 플레이어 정보 체력 : ${player.hp}, 공격력 : ${player.att}, 크리티컬 확률 : ${player.crt}, 크리티컬 대미지 : ${player.crtdmg}`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 체력 : ${monster.hp}, 공격력 : ${monster.att}|`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    if(stage.over === true){
      return;
    }

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 아무것도 하지않는다. 3. 도망친다, 4. 자살`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    switch(choice){
        case "1":
          player.attack(monster);
        break;
        case "2":
          break;
        case "3":
          break;
        case "4":
          // 종료 
          stage.over = true;
          logs.push(chalk.redBright(`플레이어가 공포에 질려 자살 했습니다. 게임이 종료됩니다.`));
          break;
        default:
          logs.push(chalk.green(`${choice}유효하지 않은 선택입니다. 다시 선택해 주세요.`));
          break;
    }

  }
  
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = {level : 1, over: false};

  while (stage.level <= 10) {
    const monster = new Monster(stage.level);
    await battle(stage, player, monster);

    if(stage.over === true){
      process.exit(0);
    }
    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
}