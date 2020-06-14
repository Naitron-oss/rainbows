const Game = {
    title: 'Rainbow Island',
    author: 'Cristian Viñuales & Laura del Toro',
    license: null,
    version: '1.0.0',
    canvasDom: undefined,
    ctx: undefined,
    FPS: 60,
    intervalId: undefined,
    framesCounter: 0,
    canvasSize: {
        w: undefined,
        h: undefined
    },
    keys: {
        SPACE: 32,
        LEFT: 37,
        RIGHT: 39,
        XKey: 88
    },
    background: undefined,
    player: undefined,
    map: undefined,
    enemies: [],
    basePosition: {
        y: undefined,
        x: undefined
    },
    initGame(id) {
        this.canvasDom = document.getElementById(id)
        this.ctx = this.canvasDom.getContext('2d')
        this.setDimensions()
        this.startGame()
    },
    setDimensions() {
        this.canvasSize.w = window.innerWidth
        this.canvasSize.h = window.innerHeight
        this.basePosition.y = this.canvasSize.h - (this.canvasSize.w / 20) * 2 //Hardcoded habrá que mirar cómo ponerlo mejor
        this.canvasDom.setAttribute('width', this.canvasSize.w)
        this.canvasDom.setAttribute('height', this.canvasSize.h)
    },

    startGame() {
        this.background = new Background(this.ctx, this.canvasSize, "images/skybackground.jpeg", this.basePosition.y)
        this.map = new Map(this.ctx, 20, 20, this.canvasSize)
        this.camera = new Camera(this.map, this.canvasSize)
        this.player = new Player(this.ctx, this.canvasSize, this.basePosition.y, "images/running.png", 8, this.keys)
        this.camera.followCharacter(this.player)
        this.enemies.push(new FloorEnemie(this.ctx, "images/floor-enemie-1.png", 2, this.framesCounter, 400, 400, 70, 70, 1, 1, this.canvasSize.w, 0), new FloorEnemie(this.ctx, "images/floor-enemie-1.png", 2, this.framesCounter, 400, this.basePosition.y, 70, 70, 1, 1, this.canvasSize.w, 0))

        this.background.createBackground()
        this.player.createImgPlayer()
        this.enemies.forEach(elm => elm.createImgEnemie())


        this.intervalId = setInterval(() => {
            this.clearGame()
            this.background.drawBackground()
            this.camera.update()
            this.map.drawMap(this.camera)
            this.player.drawPlayer(this.framesCounter)
            this.enemies.forEach(elm => elm.drawFloorEnemie(this.framesCounter))
            //this.isCollidingEnemies() ? console.log("colliding with enemie") : null
            console.log("Before colliding", this.player.playerPosition.x)
            this.isCollidingPlatfomrs(this.canvasSize.w / 20)

            this.framesCounter > 5000 ? this.framesCounter = 0 : this.framesCounter++

        }, 1000 / this.FPS)
    },
    endGame() {
        clearInterval(this.intervalId)
    },
    clearGame() {
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
    },
    isCollidingEnemies() {
        return this.enemies.some(enem => {
            return (
                this.player.playerPosition.x + this.player.playerSize.w >= enem.enemiePosition.x &&
                this.player.playerPosition.y + this.player.playerSize.h >= enem.enemiePosition.y &&
                this.player.playerPosition.x <= enem.enemiePosition.x + enem.enemieSize.w &&
                this.player.playerPosition.y < enem.enemiePosition.y + enem.enemieSize.h
            )
        })
        // (rect1.x < rect2.x + rect2.width &&
        //     rect1.x + rect1.width > rect2.x &&
        //     rect1.y < rect2.y + rect2.height &&
        //     rect1.y + rect1.height > rect2.y) 
    },
    isCollidingPlatfomrs(tSize) {
        this.map.layer.forEach((row, j) => row.forEach((col, i) => {
            if (col) {
                if (
                    this.player.playerPosition.x + this.player.playerSize.w >= tSize * i &&
                    this.player.playerPosition.y + this.player.playerSize.h >= -tSize * this.map.rows + j * tSize + this.canvasSize.h &&
                    this.player.playerPosition.x <= tSize * i + tSize &&
                    this.player.playerPosition.y < -tSize * this.map.rows + j * tSize + this.canvasSize.h + tSize
                ) console.log("collision with platform")
            }
        }))
    }
}