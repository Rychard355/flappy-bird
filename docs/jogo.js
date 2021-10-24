console.log('[Rychard Antony Pereira de Arruda] Flappy Bird')

const efeito_colisao = new Audio
const sprits = new Image

efeito_colisao.src = 'efeitos-sonoros/efeitos_hit.wav'
sprits.src = 'sprites.png'

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

let frame = 0

let pontuacao = 0
let melhor_pontuacao = 0
let parado = false
let sensor = 0
let tela_ativa = {}
let velocidade = 2

const placar = {
    desenha(){
        contexto.font = '35px "VT323"'
        contexto.textAlign= 'right'
        contexto.fillStyle = '#fff'
        contexto.fillText(`${pontuacao}`, canvas.width - 10, 35)
    },
    atualiza(){
        if(bird.x === sensor){
            pontuacao++
        }
    },
}

const bird = {
    altura: 24, largura: 34,
    x: 20, y: 50,
    gravidade: .25,
    velocidade: 0,
    forca_do_pulo: 4.5,
    assa_atual: 0,
    
    movimento:[
        {sprityX: 0, sprityY: 0}, // assa para cima
        {sprityX: 0, sprityY: 26}, // assa no meio
        {sprityX: 0, sprityY: 52}, // assa para baixo
        {sprityX: 0, sprityY: 26}, // assa no meio
    ],
    atualiza() {
        this.velocidade += this.gravidade
        this.y += this.velocidade
    },
    desenha(){
        let intervalo_de_frames = 10

        if(frame % intervalo_de_frames === 0 && !parado){
            let proxima_assa = this.assa_atual + 1

            this.assa_atual = this.assa_atual >= this.movimento.length - 1 ? 0 : proxima_assa
        }  

        let {sprityX , sprityY} = this.movimento[this.assa_atual]

        contexto.drawImage(
            sprits,
            sprityX, sprityY,
            this.largura, this.altura, 
            this.x, this.y,
            this.largura, this.altura, 
        )
    },
    pula(){
        this.assa_atual = 1
        bird.velocidade = -this.forca_do_pulo
    },
    resetar_valores(){
        this.y = 50
        this.velocidade = 0
        this.gravidade = .25
        this.forca_do_pulo = 4.5
    }
}

const chao = {
    sprityX: 0, sprityY: 610,
    altura: 112, largura: 224,
    x: 0, y: canvas.height - 112, 

    desenha(){
        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        )

        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x + this.largura, this.y,
            this.largura, this.altura,
        )
    },
    atualiza(){
        if(chao.fez_colisao_Cbird(chao)){
            setTimeout(() => {
                canos.deletar()
                mudar_para_tela(tela.game_over, false)
            },500)
            return 
        }

        if(this.x < -(this.largura / 2)){
            this.x = 0
        }
        else{
            this.x -= velocidade
        }
    },

    fez_colisao_Cbird(chao){
        birdY = bird.y + bird.altura + 10
        chaoY = canvas.height - 112
    
        if(birdY >= chaoY){
            parado = true
            efeito_colisao.play()
            return true
        }
        return false
    },
}

const canos = {
    altura: 400, largura: 52,
    frames_Psurgimento_canos : 100,
    espacamento_entre_canos: 90,

    cima: {
        sprityX: 52, sprityY: 169,
    },
    baixo: {
        sprityX: 0, sprityY: 169,
    },
    pares:[],

    desenha(){
        this.pares.forEach(function(par){
            let x_cima = par.x
            let y_cima = par.y
            let x_baixo = par.x
            let y_baixo = par.y + canos.altura + canos.espacamento_entre_canos
            
            contexto.drawImage(
                sprits,
                canos.cima.sprityX, canos.cima.sprityY,
                canos.largura, canos.altura,
                x_cima, y_cima,
                canos.largura, canos.altura
            )
            contexto.drawImage(
                sprits,
                canos.baixo.sprityX, canos.baixo.sprityY,
                canos.largura, canos.altura,
                x_baixo, y_baixo ,
                canos.largura, canos.altura
            )
        }) 
    },

    atualiza(){
        this.pares.forEach(function(par){
            sensor = canos.pares[0].x

            if(par.x + canos.largura <= 0 ){
                canos.pares.shift()
            }

            if(canos.fez_colisao_Cbird(par)){
                setTimeout(() => {
                    canos.deletar()
                    mudar_para_tela(tela.game_over, false)
                },500)
            }          
             
            par.x -= velocidade
        })

        if(frame % canos.frames_Psurgimento_canos === 0){
            this.pares.push({
                x: canvas.width, 
                y: (Math.random() + 1) * -150
            })
        }
    },

    fez_colisao_Cbird(par){
        x_bird_tras = bird.x
        x_bird_frente = bird.x + bird.largura 
        y_bird_cima = bird.y
        y_bird_baixo = bird.y + bird.altura

        x_cano_tras = par.x 
        x_cano_frente = par.x + canos.largura 
        y_cano_Dcima = par.y + canos.altura 
        y_cano_Dbaixo = par.y + canos.altura + canos.espacamento_entre_canos

        mesmo_y_cima = y_bird_cima < y_cano_Dcima
        mesmo_y_baixo = y_bird_baixo > y_cano_Dbaixo

        if( (x_cano_tras < x_bird_frente && x_cano_frente > x_bird_tras) && (mesmo_y_cima|| mesmo_y_baixo)){
            parado = true
            efeito_colisao.play()
            return true
        }
        return false
    },

    deletar(){
        canos.pares = []
    },
}

const fundo = {
    sprityX: 390, sprityY: 0,
    altura: 202, largura: 274,
    x: 0, y: canvas.height - 202,

    desenha(){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0,canvas.width,canvas.height)

        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura,
        )

        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x + this.largura, this.y,
            this.largura, this.altura,
        )
    }
}

const imagem_inicial = {
    sprityX: 134, sprityY: 0,
    altura: 152, largura: 176,
    x: canvas.width/2 - 176/2, y: 100,

    desenha(){
        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura, 
        )
    },
}

const dados_game_over = {
    sprityX: 134, sprityY: 153,
    altura: 200, largura: 226,
    x: canvas.width / 2 - 226 / 2, y: 100,
    nova_melhor_pontuacao: false,
    cor: 'red',

    desenha(){
        let txt = this.nova_melhor_pontuacao? 'novo' : ''

        contexto.drawImage(
            sprits,
            this.sprityX, this.sprityY,
            this.largura, this.altura,
            this.x, this.y,
            this.largura, this.altura
        )

        contexto.fillStyle = "black"
        contexto.textAlign = 'right'
        contexto.font = '17px "VT323"'
        contexto.fillText(`${pontuacao}`, canvas.width / 2 + 90, 190)
        contexto.fillText(`${melhor_pontuacao}`, canvas.width / 2 + 90, 230)
        if(dados_game_over.nova_melhor_pontuacao){
            contexto.fillStyle = this.cor
            contexto.fillText(`${txt}`, canvas.width / 2 + 50, 213)
        }
        dados_game_over.nova_melhor_pontuacao = false
    },

    atualiza(){
        
        if(!(melhor_pontuacao > pontuacao)){
            melhor_pontuacao = pontuacao
            dados_game_over.nova_melhor_pontuacao = true
            if(frame % 10 === 0){
                this.cor = "#"+((1<<24)*Math.random()|0).toString(16)
            }
        }
        
    },
}

const medalhas = {
    altura: 44, largura: 44,
    x: 73, y: 187,

    localizacao_Dmedalhas: [
        {sprityX: 0, sprityY: 78,},
        {sprityX: 48, sprityY: 78,},
        {sprityX: 0, sprityY: 124,},
        {sprityX: 48, sprityY: 124,},
    ],

    desenha(){
        let m = 0
        if(pontuacao >= 100)
            m = 3

        else if(pontuacao >= 70)
            m = 2

        else if(pontuacao >= 40)
            m = 1

        else
            m = 0
        let {sprityX, sprityY} = this.localizacao_Dmedalhas[m]
        
        contexto.drawImage(
            sprits,
            sprityX, sprityY,
            medalhas.largura, medalhas.altura,
            medalhas.x, medalhas.y,
            medalhas.largura, medalhas.altura
        )
    },
}

const tela = {    
    inicio: {
        atualiza(){
            chao.atualiza()
        },
        desenha(){
            fundo.desenha()
            chao.desenha()
            bird.desenha()
            imagem_inicial.desenha()
        },
        click(){
            mudar_para_tela(tela.jogo,true)
        },
    },
   
    jogo: {
        atualiza(){
            canos.atualiza()
            chao.atualiza()
            bird.atualiza()
            placar.atualiza()
        },
        desenha(){
            fundo.desenha()
            canos.desenha()
            chao.desenha()
            bird.desenha()
            placar.desenha()
        },
        click(){
            bird.pula()
        }
    },

    game_over: {
        atualiza(){
            dados_game_over.atualiza()
        },
        desenha(){
            dados_game_over.desenha()
            medalhas.desenha()
        },
        click(){
            mudar_para_tela(tela.inicio, true)
        },
    }
}

function mudar_para_tela(nova_tela,redefinir_valores){
    tela_ativa = nova_tela
    parado = false
    if(redefinir_valores){
        resetar_valores()
    }
}

function resetar_valores(){
    pontuacao = 0
    dados_game_over.repeticao = 0
    canos.deletar()
    bird.resetar_valores()
}

function loop(){
    if(!parado){
        tela_ativa.atualiza()
    }
    tela_ativa.desenha()

    frame++
    requestAnimationFrame(loop)
}

canvas.addEventListener('click', function(){
    if(tela_ativa.click()){
        tela_ativa.click
    }
} )

mudar_para_tela(tela.inicio, false)
loop()