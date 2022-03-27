import Snake from './Snake';
import Food from './Food';
import ScorePanel from './ScorePanel';
// 游戏控制器
class GameControl {
  snake: Snake;
  food: Food;
  scorePanel: ScorePanel;
  direction: string = ''
  constructor() {
    this.snake = new Snake()
    this.food = new Food()
    this.scorePanel = new ScorePanel()
    this.init()
  }

  // 初始化
  init() {
    // 绑定键盘事件
    document.addEventListener('keydown', this.keydownHandler.bind(this))
  }

  keydownHandler(event: KeyboardEvent) {
    // 只允许上下左右
    const arrow = ['up', 'down', 'left', 'right']
    const isTrue = arrow.findIndex(key => event.key.toLocaleLowerCase().indexOf(key) > -1) > -1
    if (isTrue) {
      this.direction = event.key
    }
  }
}

export default GameControl