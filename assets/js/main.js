import loadingScreen from './loadingScreen.js';
import urlAPI from './urlAPI.js';

// Quando o documento estiver pronto, adiciona o loading screen ao main
$(document).ready(() => {
    $('main').append(loadingScreen);
})

// Input upload image
let $inputFile = $('#upload-image');

// Div preview upload image
let $divPreviewUploadImage = $('.div-preview-upload-image');

// Preview upload image
let $previewUploadImage = $('.preview-upload-image');

// Label upload image
let $labelUploadImage = $('.label-upload-image');

// Ao adicionar arquivo
$inputFile.change((e) => {
    // Obtém a imagem selecionada
    let file = e.target.files[0];

    if (file) {
        // Esconde o label de upload
        $labelUploadImage.hide();

        // Mostra a div de preview da imagem
        $divPreviewUploadImage.show();

        // Define a imagem de preview como a imagem selecionada
        $previewUploadImage
            .css('background-image', `url(${URL.createObjectURL(file)})`);

        return;
    }

})

// Mostrar imagem em tela cheia

let $divImageFullScreen = $('.divImageFullScreen');

let $imageFullScreen = $('.imageFullScreen');

// Ao clicar na div de preview da imagem, mostra a imagem em tela cheia
$divPreviewUploadImage.click((e) => {
    // Retorna caso seja o botão de limpar input que foi clicado
    if ($(e.target).is('#clean-input')) {
        return;
    }

    // Obtém a imagem de background da div de preview
    const bgImage = $previewUploadImage.css('background-image');
    showImageFullScreen(bgImage);
});

// Ao clicar na imagem gerada, mostra a imagem em tela cheia
$('.img-generated').click(() => {
    const bgImage = $('.img-generated').css('background-image');

    // Mostra a imagem em tela cheia
    showImageFullScreen(bgImage);
});

// Função para mostrar a imagem em tela cheia
function showImageFullScreen(bgImage) {
    $('body').css('overflow', 'hidden'); // Esconde a barra de rolagem

    console.log(bgImage);
    const url = bgImage.slice(5, -2); // remove "url(" e ")"

    // Carrega a imagem pra pegar as dimensões reais
    const img = new Image();
    img.src = url;
    img.onload = function () {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const width = window.innerWidth * 0.9;  // 90vw em px
        const height = width * aspectRatio;

        $imageFullScreen.css({
            'width': '90vw',
            'height': height + 'px',
            'background-image': bgImage
        });

        $divImageFullScreen.css('display', 'flex');
    };
}

// Ao clicar na div de imagem em tela cheia, esconde a imagem e mostra a barra de rolagem
$divImageFullScreen.click(() => {
    $('body').css('overflow', 'auto'); // Mostra a barra de rolagem
    $divImageFullScreen.hide();
});

// Função para limpar o input de arquivo e resetar a interface
function cleanInput() {
    // Limpa o input de arquivo
    document.querySelector('#upload-image').value = '';

    // Se não houver arquivo, mostra o label de upload e esconde a div de preview
    $labelUploadImage.show();
    $divPreviewUploadImage.hide();
}

// Ao clicar no botão de limpar input
$('#clean-input').click((e) => {
    e.preventDefault();

    // Limpa o input de arquivo e reseta a interface
    cleanInput();
})

const frases = [
    "Transforme plantas em realidade",
    "Gere ambientes impressionantes",
    "Seu projeto mais realista",
    "Dê vida ao ambiente",
    "Visualize antes de executar",
    "IA para móveis planejados",
    "Transforme ideias em renders",
    "Impressione seus clientes",
    "Renderize em segundos",
    "Seu ambiente, mais real",
    "Apresente projetos com impacto",
    "Do esboço ao realismo",
    "Crie renders profissionais",
    "Seu projeto com IA",
    "Realismo para seus projetos"
];

// Typewriter effect
const $title = $('.home-title');
let fraseAtual = 0;
let charIndex = 0;
let apagando = false;

function shuffle() {
    // Pega uma frase aleatória diferente da atual
    let nova;
    do { nova = Math.floor(Math.random() * frases.length); }
    while (nova === fraseAtual);
    fraseAtual = nova;
}

function typewriter() {
    const frase = frases[fraseAtual];

    if (!apagando) {
        // Escrevendo
        charIndex++;
        $title.text(frase.slice(0, charIndex));

        if (charIndex === frase.length) {
            // Terminou de escrever — pausa antes de apagar
            apagando = true;
            setTimeout(typewriter, 2000);
            return;
        }
        setTimeout(typewriter, 60);

    } else {
        // Apagando
        charIndex--;
        $title.text(frase.slice(0, charIndex));

        if (charIndex === 0) {
            // Terminou de apagar — troca a frase
            apagando = false;
            shuffle();
            setTimeout(typewriter, 300);
            return;
        }
        setTimeout(typewriter, 30); // apaga mais rápido que escreve
    }
}

// Inicia
typewriter();

// Selecionar o formulário pelo ID
let $form = $('#form-gen-image');

// Prompt para a geração da imagem
let prompt = $('#prompt').val();

// Variável global para armazenar a URL da imagem gerada
var generatedImageURL = null;

// Função para mostrar a tela de carregamento com animação
function showLoadingScreen() {
    $('.loading')
        .stop(true)
        .css({
            'display': 'flex',
            'animation': 'showLoading 0.3s forwards'
        });
    
    // Esconde a barra de rolagem
    $('body').css('overflow', 'hidden'); // Esconde a barra de rolagem
}

// Função para esconder a tela de carregamento com animação
function hideLoadingScreen() {
    $('.loading')
        .css('animation', 'hideLoading 0.3s forwards')
        .one('animationend', function () {  // .one() em vez de .on()
            $(this).hide();
        });
    
    // Mostra a barra de rolagem
    $('body').css('overflow', 'auto'); // Mostra a barra de rolagem
}

// Adicionar um evento de submit ao formulário
$form.submit(async (e) => {
    // Prevenir o comportamento padrão do formulário
    e.preventDefault();

    // Desabilitar o botão de gerar imagem para evitar múltiplos envios
    $('.generate-btn').prop('disabled', true);

    try {


        // Obter a imagem selecionada no input de arquivo
        const image = $inputFile[0].files[0];

        if (!image) {
            showAlert('Por favor, selecione uma imagem.', 'error');
            // Habilitar o botão de gerar imagem novamente
            return $('.generate-btn').prop('disabled', false);;
        }

        // Construir o FormData para enviar a imagem e o prompt
        const formData = new FormData();

        // Adicionar a imagem e o prompt ao FormData    
        formData.append('image', image);
        formData.append('prompt', prompt);

        // Mostra a tela de carregamento
        showLoadingScreen();

        // Aguarda a requisição
        const ajaxRequest = await $.ajax({
            url: `${urlAPI}/gen_image`,
            method: 'POST',
            data: formData,

            processData: false,
            contentType: false,

            xhrFields: {
                responseType: 'blob'
            },

            success: (response) => {

                // Esconde a seção de upload e mostra a seção de imagem gerada
                const urlImage = URL.createObjectURL(response);

                // Define a variável global para a URL da imagem gerada
                generatedImageURL = urlImage;

                // Esconde a seção de upload e mostra a seção de imagem gerada
                const img = new Image();

                // Quando a imagem for carregada, calcula as proporções e ajusta o estilo da div de imagem gerada
                img.onload = () => {
                    // Calcula as proporções da imagem
                    $('.img-generated').css('background-image', `url(${urlImage})`);

                    const duration = 3000;
                    const animationEnd = Date.now() + duration;

                    const interval = setInterval(() => {

                        if (Date.now() > animationEnd) {
                            return clearInterval(interval);
                        }

                        confetti({
                            particleCount: 8,
                            spread: 360,
                            startVelocity: 30,
                            origin: {
                                x: Math.random(),
                                y: Math.random() - 0.2
                            }
                        });

                    }, 150);

                };

                // Define a fonte da imagem como a URL do blob retornado pela API
                img.src = urlImage;

                // Esconde a seção de upload e mostra a seção de imagem gerada
                $('#sec-form').hide();
                $('#sec-img-generated').css('display', 'flex');
            },
            error: async (error) => {
                // Status text
                const statusText = error.statusText;

                // Tenta extrair a mensagem de erro do corpo da resposta
                let message = 'Ocorreu um erro ao gerar a imagem. Tente novamente.';

                // Error 404
                if (statusText == 'NOT FOUND') {
                    message = 'Endpoint ou imagem não encontrado.';
                }

                // Error 429
                if (statusText == 'TOO MANY REQUESTS') {
                    message = 'Limite de gerações atingido. Tente novamente em alguns minutos.';
                }

                // Error 503
                if (statusText == 'SERVICE UNAVAILABLE') {
                    message = 'O serviço está com alta demanda no momento. Tente novamente em instantes.';
                }

                // Exibe a mensagem de erro usando a função showAlert
                return showAlert(message, 'error');

            }
        })

    } finally {
        // Habilitar o botão de gerar imagem novamente
        $('.generate-btn').prop('disabled', false);

        // Esconde a tela de carregamento
        hideLoadingScreen();
    }
})

// Mensagem de alert
function showAlert(message, type) {
    // Seleciona a div de alert
    const $divAlert = $(`.divAlertMessage`);

    // Cria a mensagem de alert
    const $message = $(`<div></div>`)
        .addClass('message')
        .addClass(type === 'success' ? 'success' : 'error');

    const $p = $(`<p></p>`).text(message);

    const $i = $(`<i></i>`)
        .addClass('fa-solid')
        .addClass(type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark');

    // Remove a mensagem de alert após a animação de desaparecimento
    $message.on('animationend', function () {
        $(this).remove();
    });

    // Adiciona a mensagem de alert à div de alert
    $message.append($i).append($p);

    // Adiciona a mensagem de alert à div de alert
    $divAlert.append($message);
}

// ====== BOTÕES DE COMPARTILHAR E BAIXAR ======

// Botão de baixar

// Ao clicar no botão de download
$('#download-btn').click(() => {

    if (!generatedImageURL) return;

    const a = document.createElement('a');

    a.href = generatedImageURL;

    // Define o nome do arquivo para download
    a.download = `render-ai-${Date.now()}.png`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

});

// Botão de compartilhar

$('#share-btn').click(async () => {

    if (!generatedImageURL) return;

    try {

        const response = await fetch(generatedImageURL);

        const blob = await response.blob();

        const file = new File(
            [blob],
            'render-ai.png',
            { type: 'image/png' }
        );

        await navigator.share({
            title: 'Render AI',
            text: 'Olha essa render gerada por IA',
            files: [file]
        });

    } catch (error) {

        console.error(error);

    }

});

// Botão de refazer

$('#regenerate-btn').click(() => {
    $form.submit();
})

// Botão voltar

$('.voltar-btn').click(() => {
    // Esconde a seção de imagem gerada e mostra a seção de upload
    $('#sec-img-generated').hide();
    $('#sec-form').css('display', 'flex');

})

// Ao digitar no textarea do prompt, ajusta a altura do textarea com base no comprimento do texto
$('#prompt').on('input', function () {
    prompt = $(this).val();

    if (prompt.length > 75) {
        $(this).css('height', '100px');
    } else {
        $(this).css('height', '50px');
    }

})