import chalk from 'chalk';
import {sleep} from './game.js'

export class Player {
    constructor() {
        this.hp = 100;
        this.attack_min = 9;
        this.attack_max = 1.3;
        this.dobble_attack = 25;
        this.guard = 55;
        this.escape = 2;
    }
    //체력
    getHp() {
        return this.hp
    }
    setHp(hp) {
        this.hp = hp
    }
    //최소 공격력 값
    getAttack_min() {
        return this.attack_min
    }
    setAttack_min(attack_min) {
        this.attack_min = attack_min
    }
    //최대 공격력 배율
    getAttack_max() {
        return this.attack_max
    }
    setAttack_max(attack_max) {
        this.attack_max = attack_max
    }
    //연속 공격 확률
    getDobble_attack() {
        return this.dobble_attack
    }
    setDobble_attack(dobble_attack) {
        this.dobble_attack = dobble_attack
    }
    //방어 확률
    getGuard() {
        return this.guard
    }
    setGuard(guard) {
        this.guard = guard
    }
    //도망 확률
    getEscape() {
        return this.escape
    }
    setEscape(escape) {
        this.escape = escape
    }

}


export async function playerStatsUp(player, stage) {
    //스테이지 클리어 보상으로 체력 회복
    player.setHp(player.getHp() + 50 * stage)
    console.log(chalk.green(`플레이어가 스테이지 클리어 보상으로 체력이 ${50 * stage}만큼 회복합니다.`))
    await sleep(1000)
    //스테이지 클리어시 랜덤 능력치 상승
    let percent = Math.floor(Math.random() * 6)
    let ability
    let Stats

    if (percent === 1) {
        //체력 20 ~ 50
        ability = Math.floor(Math.random() * 31) + 20
        player.setHp(player.getHp() + ability)
        Stats = "체력"
    }
    else if (percent === 2) {
        //최소 공격력 5 ~ 20
        ability = Math.floor(Math.random() * 16) + 5
        player.setAttack_min(player.getAttack_min() + ability)
        Stats = "최소 공격력"
    }
    else if (percent === 3) {
        //최대 공격력 배율(0.1 ~ 1)
        ability = Math.floor(Math.random()) + 0.1
        player.setAttack_max(player.getAttack_max() + ability)
        Stats = "최대 공격력 배율"
    }
    else if (percent === 4) {
        // 도망 확률 1 ~ 3
        ability = Math.floor(Math.random() * 3) + 1
        player.setEscape(player.getEscape() + ability)
        Stats = "도망 확률"
    }
    else if (percent === 5) {
        // 연속 공격 확률 3 ~ 7
        ability = Math.floor(Math.random() * 5) + 3
        player.setDobble_attack(player.getDobble_attack() + ability)
        Stats = "연속 공격 확률"
    }
    else {
        //방어 확률 3 ~ 10
        ability = Math.floor(Math.random() * 8) + 3
        player.setGuard(player.getGuard() + ability)
        Stats = "방어 확률"
    }
    console.log(chalk.green(`플레이어 ${Stats}이 ${ability}만큼 증가하였습니다.`))
}
