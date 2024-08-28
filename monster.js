export class Monster {
    constructor() {
      this.hp = 100;
      this.attack_min = 5;
      this.attack_max = 1.2;
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
  
  }

export async function monsterStatsUp(monster,stage){
    //확률에 따라 몬스터 난이도 지정
    let percent = Math.floor(Math.random() * 4) 
    let monsterHp
    let monsterAttack
    let monsterCritical
    if(percent === 0){ // 기본형 몬스터
      monsterHp = 90 + stage * 10
      monsterAttack = 4 + stage
      await monster.setHp(monsterHp)
      await monster.setAttack_min(monsterAttack)
      await monster.setAttack_max(1.2)
    }
    else if (percent === 1){ // 탱커형 몬스터
      monsterHp = 90 + stage * 15
      monsterAttack = 4 + Math.floor(stage / 2)
      await monster.setHp(monsterHp)
      await monster.setAttack_min(monsterAttack)
      await monster.setAttack_max(1.2)
    }
    else if (percent === 2){ //딜러형 몬스터
      monsterHp = 90 + stage * 5
      monsterAttack = 4 + stage * 2
      await monster.setHp(monsterHp)
      await monster.setAttack_min(monsterAttack)
      await monster.setAttack_max(1.2)
    }
    else if (percent === 3){ //크리티컬형 몬스터
      monsterHp = 90 + stage * 2
      monsterAttack = 4 + stage
      monsterCritical = 1.2 * stage
      await monster.setHp(monsterHp)
      await monster.setAttack_min(monsterAttack)
      await monster.setAttack_max(monsterCritical)
    }
    
  }