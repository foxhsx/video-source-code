class Snake {
  head: HTMLElement; // 舌头
  bodies: HTMLCollection;
  element: HTMLElement;
  constructor() {
    this.element = document.getElementById('snake')!
    // 使用类型断言
    this.head = document.querySelector('#snake > div') as HTMLElement;
    this.bodies = this.element.getElementsByTagName('div')
  }

  // 获取蛇头的坐标
  get X() {
    return this.head.offsetLeft
  }
  get Y() {
    return this.head.offsetTop
  }

  // 设置蛇头的坐标
  set X(value: number) {
    if (this.X === value) return
    // 是否撞墙
    if (value < 0 || value > 290) {
      throw new Error('撞墙了！')
    }
    this.head.style.left = value + 'px'
  }
  set Y(value: number) {
    if (this.Y === value) return
    // 是否撞墙
    if (value < 0 || value > 290) {
      throw new Error('撞墙了！')
    }
    this.head.style.top = value + 'px'
  }

  // 增加身体
  addBody() {
    this.element.insertAdjacentHTML('beforeend', "<div></div>")
  }
}

export default Snake