import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player, playerStatsUp } from './player.js';
import { Monster, monsterStatsUp } from './monster.js';



function selection(num, player, monster, logs) {

  switch (num) {
    case "1": //기본공격
      attack("player", player, monster, logs)
      return ["attack", true]
    case "2": //연속공격
      let percent = Math.floor(Math.random() * 100)
      if (percent <= player.getDobble_attack()) { //공격 성공
        attack("player", player, monster, logs)
        attack("player", player, monster, logs)
        return ["attack", true]
      }
      else { //공격 실패
        logs.push(chalk.red('연속 공격이 실패했습니다.'))
        return ["attack", false]
      }
    case "3": //방어
      if (defense(player, logs)) {
        return ["guard", true]
      }
      else {
        return ["guard", false]
      }

    case "4": //도망
      if (runaway(player, logs)) {
        return ["escape", true]
      }
      else {
        return ["escape", false]
      }
    default: //재입력
      logs.push(chalk.yellow('잘못된 입력입니다. 1 ~ 4 중 다시 선택해주세요.'))
      return ["retry", true]
  }
}
function defense(player, logs) {
  //방어
  let percent = Math.floor(Math.random() * 100) + 1 // 1 ~ 100 중 랜덤 값
  if (percent <= player.getGuard()) {
    logs.push(chalk.green('플레이어가 방어에 성공하였습니다.'))
    return true
  }
  else {
    logs.push(chalk.green('플레이어가 방어에 실패하였습니다.'))
    return false
  }
}
function runaway(player, logs) {
  //도망
  let percent = Math.floor(Math.random() * 100) + 1 // 1 ~ 100 중 랜덤 값
  if (percent <= player.getEscape()) {
    logs.push(chalk.green('플레이어가 도망에 성공하였습니다.'))
    return true
  }
  else {
    logs.push(chalk.green('플레이어가 도망에 실패하였습니다.'))
    return false
  }
}
function attack(attacker, player, monster, logs) {

  if (attacker === "player") {
    // 플레이어의 공격 - 변동 값(반올림) + 최소 데미지
    let damage = Math.round(Math.random() * (parseInt(player.getAttack_min() * player.getAttack_max()) - player.getAttack_min() + 1)) + player.getAttack_min()
    let monster_hp = monster.getHp() - damage
    //몬스터 체력 변경
    monster.setHp(monster_hp)
    logs.push(chalk.green(`${damage} 만큼 피해를 입혔습니다. 몬스터 남은 체력: ${monster.getHp()}`))
  }
  else if (attacker === "monster") {
    // 몬스터의 공격
    let damage = Math.round(Math.random() * (parseInt(monster.getAttack_min() * monster.getAttack_max()) - monster.getAttack_min() + 1)) + monster.getAttack_min()
    let player_hp = player.getHp() - damage
    //플레이어 체력 변경
    player.setHp(player_hp)
    logs.push(chalk.red(`${damage} 만큼 피해를 입었습니다. 내 남은 체력: ${player.getHp()}`))
  }
  else {

  }
  return
}





function displayStatus(stage, player, monster) {
  //상태 표시
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| Player HP: ${player.getHp()} Attack: ${player.getAttack_min()} ~ ${parseInt(player.getAttack_min() * player.getAttack_max())} `
    ) +
    chalk.redBright(
      `| Monster HP: ${monster.getHp()} Attack: ${monster.getAttack_min()} ~ ${parseInt(monster.getAttack_min() * monster.getAttack_max())}|`
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

// export function sleep(ms) {
//   const start = Date.now();
//   while (Date.now() - start < ms) { }
//   return
// }
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let playerResult;
  while (player.getHp() > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.slice(-12).forEach(async (log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격(${player.getDobble_attack()}%) 3. 방어한다(${player.getGuard()}%) 4. 도망친다(${player.getEscape()}%)`
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    // 플레이어 턴
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    playerResult = selection(choice, player, monster, logs)

    // 몬스터 사망 확인
    if (monster.getHp() <= 0) {
      console.clear();
      displayStatus(stage, player, monster);

      console.log(chalk.bgBlue(`몬스터가 사망했습니다.`));
      sleep(1000)
      break
    }
    // 몬스터 턴
    if (playerResult[0] === "guard" && playerResult[1] === true) {
      //방어 성공시
    }
    else if (playerResult[0] === "escape" && playerResult[1] === true) {
      //도망 성공시
      break
    }
    else if (playerResult[0] === "retry") {
      //재입력 요망시
    }
    else {
      //몬스터 공격
      attack("monster", player, monster, logs)
    }
    await sleep(500)
  }
  if (player.getHp() > 0 && monster.getHp() <= 0) {
    //몬스터 처치시
    return true
  }
  else if (playerResult[0] === "escape" && playerResult[1] === true) {
    //도망 성공시
    return true
  }
  else {
    //플레이어 사망시
    return false
  }

};


export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;
  const monster = new Monster();
  while (stage <= 10) {
    await monsterStatsUp(monster, stage)
    const battleResult = await battle(stage, player, monster);
    await sleep(1000)
    //스테이지 클리어시
    if (battleResult) {
      await playerStatsUp(player, stage)
    }
    else {
      console.log(chalk.red("플레이어가 사망하였습니다."))
      for (let exit = 3; exit > 0; exit--) {
        console.log(chalk.red(`${exit}초 후 종료됩니다.`))
        await sleep(1000)
      }
      break
    }

    await sleep(2000)

    // 스테이지 클리어 및 게임 종료 조건
    stage++;
  }
  if (stage > 10) {
    console.log(chalk.bgBlue(`축하합니다. 10 스테이지까지 모두 완료하였습니다.`))
    for (let exit = 3; exit > 0; exit--) {
      console.log(chalk.red(`${exit}초 후 종료됩니다.`))
      await sleep(1000)
    }
  }
}