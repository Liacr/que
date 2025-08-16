const elementoLetras = document.getElementById("letra-animada");
const container = document.querySelector(".container");

const letrasMusica = [
  "I wanna da - ",
  "I wanna dance in the lights  ",
  "I wanna ro - ",
  "I wanna rock your body ",
  "I wanna go - ",
  "I wanna go for a ride ",
  "Hop in the music and   ",
  "Rock your body ", //8
  "Rock that body ", //9
  "Come on, Come on ", //10
  "Rock that body ", //11
  "(Rock yo' body) ", //12
  "Rock that body ", //13
  "Come on, Come on ", //14
  "Rock -that bo-dy ", //15
];

let audio = null;
let musicaTocando = false;
let mostrandoMensagem = false;
let animandoTexto = false;

function iniciarApp() {
  mostrarMensagemClique();

  // Adiciona o evento de clique no container
  container.addEventListener("click", () => {
    if (mostrandoMensagem) {
      esconderMensagemClique();
      tentarTocarMusica();
    }
  });
}

// Função que mostra a mensagem para clicar
function mostrarMensagemClique() {
  if (mostrandoMensagem) return;

  mostrandoMensagem = true;

  const mensagemClique = document.createElement("div");
  mensagemClique.id = "click-play";
  mensagemClique.innerHTML = "▶️";
  mensagemClique.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6rem;
    background: #2a5298;
    cursor: pointer;
    animation: pulse 2s infinite;
    z-index: 1000;
  `;
  container.appendChild(mensagemClique);
}

// Função que esconde a mensagem de clique
function esconderMensagemClique() {
  const mensagemClique = document.getElementById("click-play");
  if (mensagemClique) {
    mensagemClique.remove();
    mostrandoMensagem = false;
  }
}

function tentarTocarMusica() {
  // Se não existe o objeto de áudio, cria um novo
  if (!audio) {
    audio = new Audio();
    audio.src = "./Rock That Body.mp3";
    audio.volume = 0.7; // Volume a 70%
    audio.currentTime = 0; // Começa do início
    audio.addEventListener("ended", () => {
      console.log("Música terminou, reiniciando automaticamente");
      audio.currentTime = 0;
      audio.play();
      // Reinicia a animação também
      animandoTexto = false;
      elementoLetras.innerHTML = "";
      iniciarAnimacao();
    });
  }

  // Tenta tocar a música
  audio
    .play()
    .then(() => {
      // Se conseguiu tocar
      console.log("Música tocando com sucesso!");
      musicaTocando = true;
      esconderMensagemClique();
      iniciarAnimacao()
    })
    .catch((erro) => {
      // Se não conseguiu tocar (navegador bloqueou)
      console.log("Navegador bloqueou o autoplay:", erro);
      musicaTocando = false;
      mostrarMensagemClique();
    });
}

async function iniciarAnimacao() {
  if (animandoTexto || !musicaTocando) return;

  animandoTexto = true;
  console.log("Iniciando animação das letras");

  iniciarEfeitosVisuais();
  // Espera 8 segundos (quando as letras começam na música)
  await esperar(8300);
  // Anima todas as letras
  await animarTodasAsLetras();
}

function iniciarEfeitosVisuais() {
  const morty = document.querySelector("dotlottie-wc");
      // Verifica se o elemento foi encontrado (compatibilidade com Firefox)
    if (!morty) {
      console.log("[v0] Elemento dotlottie-wc não encontrado - possível problema de compatibilidade");
      return;
    }
  const body = document.body;

  // Array de cores para o fundo
  const cores = ["#ff0080", "#00ff80", "#8000ff", "#ff8000", "#0080ff", "#ff0040", "#40ff00"];
  let corAtual = 0;

  // Efeitos de fundo - muda cor a cada 500ms (batida da música)
  const intervaloCor = setInterval(() => {
    if (!musicaTocando) {
      clearInterval(intervaloCor);
      return;
    }

    body.style.background = `linear-gradient(45deg, ${cores[corAtual]}, ${cores[(corAtual + 1) % cores.length]})`;
    body.style.transition = "background 0.2s ease";
    corAtual = (corAtual + 1) % cores.length;
  }, 500);

  // Efeitos do Morty apenas no hover
  let intervaloMortyHover = null;

  morty.addEventListener("mouseenter", () => {
    if (!musicaTocando) return;

    // Inicia efeitos loucos quando mouse entra
    let rotacao = 0;
    let escalaX = 1;
    let escalaY = 1;

    intervaloMortyHover = setInterval(() => {
      // Rotação aleatória
      rotacao += Math.random() * 180 - 90;

      // Flip horizontal e vertical aleatórios
      escalaX = Math.random() > 0.5 ? 1 : -1;
      escalaY = Math.random() > 0.7 ? 1 : -1;

      morty.style.transform = `scale(${escalaX}, ${escalaY}) rotate(${rotacao}deg)`;
      morty.style.transition = "transform 0.3s ease";
    }, 200);
  });

  morty.addEventListener("mouseleave", () => {
    // Para efeitos quando mouse sai
    if (intervaloMortyHover) {
      clearInterval(intervaloMortyHover);
      intervaloMortyHover = null
    }

    // Volta ao normal
    morty.style.transform = "scale(1, 1) rotate(0deg)";
    morty.style.transition = "transform 0.5s ease";
  });

  setTimeout(() => {
    if (!musicaTocando) return;

    // Primeiro "Come on, Come on" aos 24.5s
    const intervaloIntenso1 = setInterval(() => {
      body.style.background = `linear-gradient(${Math.random() * 360}deg, 
        hsl(${Math.random() * 360}, 100%, 50%), 
        hsl(${Math.random() * 360}, 100%, 50%))`
    }, 100)

    setTimeout(() => clearInterval(intervaloIntenso1), 1500)
  }, 24500)

  setTimeout(() => {
    if (!musicaTocando) return;

    // Segundo "Come on, Come on" aos 28.2s
    const intervaloIntenso2 = setInterval(() => {
      body.style.background = `radial-gradient(circle, 
        hsl(${Math.random() * 360}, 100%, 50%), 
        hsl(${Math.random() * 360}, 100%, 30%))`
    }, 80)

    setTimeout(() => clearInterval(intervaloIntenso2), 2000)
  }, 28200)
}

async function animarTodasAsLetras() {
  console.log("Começando animação das letras");

  // Primeira metade (linhas 0-7)
  for (let i = 0; i < 8; i++) {
    const linha = letrasMusica[i];
    const velocidade = obterVelocidadeDigitacao(i);

    // Anima a linha atual
    await digitarTexto(linha, velocidade);

    // Tempo de espera antes da próxima linha
    const tempoEspera = obterTempoEspera(i);
    await esperar(tempoEspera);
  }

  elementoLetras.innerHTML = "";

  // Segunda metade (linhas 8-14)
  for (let i = 8; i < letrasMusica.length; i++) {
    const linha = letrasMusica[i];
    const velocidade = obterVelocidadeDigitacao(i);

    // Anima a linha atual
    await digitarTexto(linha, velocidade);

    // Tempo de espera antes da próxima linha
    const tempoEspera = obterTempoEspera(i);
    await esperar(tempoEspera);
  }
}

function obterTempoEspera(indiceLinha) {
  const tempos = [
    8200, // "I wanna da - "
    8900, // "I wanna dance in the lights  "
    11900, // "I wanna ro - "
    12900, // "I wanna rock your body "
    15600, // "I wanna go - "
    16600, // "I wanna go for a ride "
    19250, // "Hop in the music and   "
    21000, // "Rock your body "
    22200, // "Rock that body "
    23200, // "Come on, Come on "
    23950, // "Rock that body "
    24100, // "(Rock yo' body) "
    24500, // "Rock that body "
    25100, // "Come on, Come on "
    25150, // "Rock -that bo-dy "
  ]

  if (indiceLinha < tempos.length - 1) {
    const tempoInicioProximaLinha = tempos[indiceLinha + 1];
    const tempoInicioLinhaAtual = tempos[indiceLinha];
    const duracaoDigitacaoLinhaAtual = letrasMusica[indiceLinha].length * obterVelocidadeDigitacao(indiceLinha);
    const tempoEsperaCalculado = tempoInicioProximaLinha - tempoInicioLinhaAtual - duracaoDigitacaoLinhaAtual;
    return Math.max(0, tempoEsperaCalculado);
  }
  return 0;
}

function obterVelocidadeDigitacao(indiceLinha) {
  return 60; // Velocidade padrão para todas as linhas
}

// Função que faz o efeito de digitação (typewriter)
async function digitarTexto(texto, velocidade = 60) {
  return new Promise((resolver) => {
    // Cria um novo elemento div para a linha
    const elementoLinha = document.createElement("div");
    elementoLinha.className = "line";

    // Adiciona a linha no container das letras
    elementoLetras.appendChild(elementoLinha);

    // Variáveis para controlar a digitação
    let textoAtual = "";
    let indiceCaracter = 0;

    // Intervalo que adiciona uma letra por vez
    const intervaloDigitacao = setInterval(() => {
      if (indiceCaracter < texto.length) {
        // Adiciona o próximo caractere
        textoAtual += texto[indiceCaracter];
        elementoLinha.textContent = textoAtual;
        indiceCaracter++;
      } else {
        // Terminou de digitar, para o intervalo
        clearInterval(intervaloDigitacao);
        resolver(); // Resolve a Promise
      }
    }, velocidade); // Velocidade em milissegundos por caractere
  });
}

function reiniciarTudo() {
  console.log("Reiniciando o meme");

  animandoTexto = false;
  elementoLetras.innerHTML = "";

  document.body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const morty = document.querySelector("dotlottie-wc");
  if (morty) {
    morty.style.transform = "scale(1, 1) rotate(0deg)";
  }

  // Para a música e volta para o início
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    musicaTocando = false;
  }

  // Espera 1 segundo e mostra a mensagem de clique novamente
  setTimeout(() => {
    mostrarMensagemClique();
  }, 1000);
}

// Função auxiliar para criar delays (esperas)
function esperar(milissegundos) {
  return new Promise((resolver) => setTimeout(resolver, milissegundos));
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Página carregada, iniciando o meme");
  iniciarApp();
})
