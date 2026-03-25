/*Wiadomość dla ciebie ciekawska istoto, to co tu widzisz to jest kamień milowy programisty
który został stworzony na trzeźwo ale czy spełna rozumu? Tego nie wiem*/
kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    letterbox: false,
    background: [61, 132, 255],
})

// Obsługa zmiany rozmiaru okna
window.addEventListener('resize', () => {
    if (window.innerWidth !== width() || window.innerHeight !== height()) {
        // Gra automatycznie się przeskaluje dzięki kaplay
    }
})

if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js")
        .then(()=> console.log("Magazynier (Service Worker) zatrudniony"))
        .catch((err) => console.log("Magazynier nie przyszedł do pracy: ", err))
}

loadSprite('papiez', './sprite/papiez.png')
loadSprite('background', './sprite/background_floppy.png')
loadFont("retro", './font/Minecraft.ttf')
loadSprite('player', "./sprite/fly.png",{
    sliceX: 3,
    anims:{
        idle:{from: 0, to: 2, loop: true}
    }
})
loadSprite("settings", "./sprite/settings-icon.png")
loadSprite('pirania', './sprite/pirahna_plant — kopia.png')
loadSprite('ez_btn', './sprite/easy_button.png')
loadSprite('hrd_btn', './sprite/hard_button.png')
loadSprite('back_btn', './sprite/back_btn.png')


//? Dźwięki
loadSound("jump", './sound/freesound_community-flappy_whoosh-43099.mp3')
loadSound('coin', './sound/universfield-game-bonus-02-294436.mp3')
loadSound('gameover', './sound/universfield-game-over-deep-male-voice-clip-352695.mp3')
loadSound('ambient', './sound/moodmode-8-bit-arcade-mode-158814.mp3')
loadSound('gameover_music', './sound/alphix-game-over-417465.mp3')
loadSound('boom', './sound/bithuh-vine-boom-392646.mp3')
loadSound('mango', './sound/DiscoAdamusSigmaBoy & Rastafarianin Mango67 Viral Tiktok (mp3cut.net).mp3')
loadSound('barka', './sound/barka-made-with-Voicemod.mp3')

const hitboxRozmiar =  vec2(0.25, 0.95)
const easyMode = { gap: 360,  nazwa: "Easy" };
const normalMode = {gap: 330,  nazwa: "Hard" };

let gameMode = localStorage.getItem('difficulty') 
let wybraneUstawienia;

if (gameMode === 'Easy') {
    wybraneUstawienia = easyMode;
} else {
    wybraneUstawienia = normalMode; 
}

const music = play('ambient',{
    volume: 0.5,
    loop: true
})

//! Scena ustawień

scene('ustawienia', ()=>{
    add([
        sprite('background'),
        pos(0,0),
        scale(width() / 320, height() / 480),
        fixed()
    ])
    add([
        text('Settings', {
            font: 'retro',
            size: 45
        }),
        pos(width() / 2, height() / 2 - 70),
        anchor('center')
    ])
    add([
        text("Mode: " + wybraneUstawienia.nazwa, {
            font: 'retro',
            size: 20
        }),
        pos(width() / 2, height() / 2 - 20),
        anchor('center'),
    ])
    const btnEasy = add([
        sprite('ez_btn'),
        pos(width() / 2, height() / 2 + 55),
        anchor('center'),
        area(),
        scale(3),
    ])
    const btnHard = add([
        sprite('hrd_btn'),
        pos(width() / 2, height() / 2 + 105),
        anchor('center'),
        area(),
        scale(3)
    ])
    const btnBack = add([
        sprite('back_btn'),
        pos(width()/2, height() - 60),
        anchor('center'),
        area(),
        scale(3)
    ])
    btnEasy.onClick(() => {
        wybraneUstawienia = easyMode;
        localStorage.setItem('difficulty', 'Easy');
        go('start');
    });
    btnHard.onClick(() => {
        wybraneUstawienia = normalMode;
        localStorage.setItem('difficulty', 'Hard');
        go('start');
    })
    btnBack.onClick(() => {
        go('start')
    })
})

//! Scena startowa

scene('start', ()=>{
    add([
    sprite('background'),
    pos(0,0),
    scale(width() / 320, height() / 480),
    fixed()
    ])
    add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(0, height() / 2 + 50),
        scale(7)
    ])
    const settings = add([
        sprite("settings"),
        pos(0,height() - 50),
        area(),
        z(100),
    ])
    settings.onClick(() => {
        go('ustawienia')
    })

    const title = add([
        text('Floppy Fly',{
            font: 'retro',
            size: 45
        }),
        pos(width() / 2, height() / 2 - 50),
        anchor('center')
    ])
        const press_key = add([
        text("Press on screen or space to play!",{
            font: 'retro',
            size: 18
        }),
        anchor('center'),
        pos(width() / 2, height() / 2 + 50),
        opacity(1)
    ])
    onKeyPress('space', () =>{
        if(!settings.isHovering()){
            go('gra', wybraneUstawienia)
        }
        })
    onClick(() => {
        if(!settings.isHovering()){
            go('gra', wybraneUstawienia)
        }
    })
    loop(0.75, ()=>{   
        if (press_key.opacity === 1){
            press_key.opacity = 0
        }else{
            press_key.opacity = 1
        }
    })
})

//! Główna scena gry

scene('gra', () =>{
    setGravity(2400)
    music.play()

    let gap = wybraneUstawienia.gap
    let speed = 200;

    const background1 = add([
    sprite('background'),
    pos(0,0),
    scale(width() / 320, height() / 480),
    fixed(),
    move(LEFT, 50),
    'tlo'
    ])

    const background2 = add([
        sprite('background'),
        pos(width(),0),
        scale(width() / 320, height() / 480),
        fixed(),
        move(LEFT, 50),
        'tlo'
    ])

    onUpdate('tlo', (p) => {
        if (p.pos.x <= - width()){
            p.pos.x = width()
        }
    })


    let highScore 
    if (localStorage.getItem('highScore') == null){
        highScore = 0
    }else{
        highScore = localStorage.getItem('highScore')
    }

    let scoreShadow = add([
        text("", {
        font: 'retro',
        size: '38'
    }),
    pos(width() / 2 + 2 , 24),
    color(0,0,0),
    { value: 0 },
    z(99)
    ])

    let score = add([
    text("", {
        font: 'retro',
        size: '38'
    }),
    pos(width() / 2, 22),
    { value: 0 },
    z(100)
    ])
    score.text = score.value
    scoreShadow.text = scoreShadow.value

    let highScoreText = add([
    text("",{
        font: 'retro',
        size: '26'
    }),
    pos(24, 60),
    { value: 0 },
    z(100)
    ])

    highScoreText.value = highScore; // highscore on screen when u play 


    const player = add([
        sprite("player", {
            anim: 'idle',
        }),
        pos(80, height() / 2),
        anchor('center'), //? wyśrodkowuje hitboxa
        area({scale: 0.35,
            shape: new Rect(vec2(0), 10, 10),
        }), 
        body(),
        scale(8)
    ])
    const getRandomNumber = (min, max) =>{
        return Math.random() * (max - min) + min
    }



    function generujRury() {
        const center = getRandomNumber(150, 330);
        const przesuniecie = 180; 

        let punkt = add([
            pos(width(), center),
            rect(20, gap),
            opacity(0),
            move(LEFT, speed),
            area(),
            anchor('center'),
            'punkt'
        ])

        const dolna = add([
            sprite('pirania'),
            pos(width(), center + gap / 2 + przesuniecie),
            anchor('center'),
            scale(6),
            area({scale: hitboxRozmiar}),
            move(LEFT, speed),
            offscreen({destroy: true}),
            "pirania" 
        ])

        const gorna = add([
            sprite('pirania', {flipY: true}),
            pos(width(), center - gap / 2 - przesuniecie ),
            anchor('center'),
            scale(6),
            area({scale: hitboxRozmiar}),
            "pirania" 
        ])

        gorna.onUpdate(() => {
            if (dolna.pos) {
                gorna.pos.x = dolna.pos.x;
            }
        });

        dolna.onDestroy(() => {
            destroy(gorna);
        });
        wait(300 / speed, generujRury);
    }
    generujRury();

    player.onCollide('punkt', (p) => {
        score.value += 1
        scoreShadow.value += 1
        play('coin', {
            volume: 0.3
        })
        score.text = score.value
        scoreShadow.text = scoreShadow.value
        destroy(p);
        if(score.value > highScoreText.value){
            highScoreText.value = score.value
            localStorage.setItem('highScore', highScoreText.value)
        }
            // adding points to high score if score is higher than highscore

        if(score.value > 0 && score.value % 20 === 0 && speed < 300 ){
            speed += 10
        }
        if(score.value == 67){
            const mango = play('mango')
            wait(10, ()=> mango.stop())
        }
        
        if(score.value == 21 && highScoreText.value == 37 || score.value == 2137){
            const papiez = add([
                sprite('papiez'),
            pos(width()/2 - 100, height() / 2),
            move(UP, 200),
            'papiez'
            ])
            const barka = play('barka') 
            wait(8, () => barka.stop())
            if(papiez.pos.y < 0){
                destroy(papiez)
            }
        }
    })

    onKeyPress("space", () => {
        player.jump()
        play('jump', {
            volume: 0.5
        })   
    })
    onClick(() => {
        player.jump()
        play('jump', {
            volume: 0.5
        })   
    })


    player.onCollide("pirania", () => {
        destroy(player)
        music.stop()
        play('boom')
        addKaboom(player.pos)
        wait(1, () => go('koniec', score.value))
    })

    player.onUpdate(() => {
        if (player.pos.y < 0 || player.pos.y > height()) {
            destroy(player)
            music.stop()
            play('boom')
            addKaboom(player.pos)
            wait(1, () => {go('koniec', score.value)})
        }
    })
})

//! Scena końcowa

scene('koniec', (zdobytePunkty)=>{
    play('gameover_music')
    play('gameover')
    add([
    sprite('background'),
    pos(0,0),
    scale(width() / 320, height() / 480),
    fixed()
    ])

    add([
        text('Game Over', {
            font: 'retro',
            size: 36
        }),
        color(0,0,0),
        pos(width()/2 + 2, height()/2 - 98),
        anchor('center'),
        z(99)
    ])

    add([
        text('Game Over', {
            font: 'retro',
            size: 36
        }),
        pos(width()/2, height()/2 - 100),
        anchor('center'),
        z(100)
    ])
    add([
        text('Score: ' + zdobytePunkty,{
            font: 'retro',
            size: 28
        }),
        pos(width()/2, height()/2 - 10),
        anchor('center')
    ])
    add([
        text('High Score: ' + (localStorage.getItem('highScore') || 0 ),{
            font: 'retro',
            size: 28
        }),
        pos(width()/2, height()/2 + 50),
        anchor('center')
    ])
        const settings = add([
        sprite("settings"),
        pos(0,height() - 50),
        area(),
        z(100)
    ])
    settings.onClick(() => {
        go('ustawienia')
    })
    const migajacyNapis = add([
        text("Press on screen or space to retry!",{
            font: 'retro',
            size: 18
        }),
        anchor('center'),
        pos(width() / 2, height() / 2 + 120),
        opacity(1),
        'napis'
    ])
    loop(0.75, ()=>{   
        if (migajacyNapis.opacity === 1){
            migajacyNapis.opacity = 0
        }else{
            migajacyNapis.opacity = 1
        }
    })
    onKeyPress('space', () =>{
        if(!settings.isHovering()){
            go('gra', wybraneUstawienia)
        }
    })
    onClick(() =>{
        if(!settings.isHovering()){
            go('gra', wybraneUstawienia)
        }
    })

})
go('start')