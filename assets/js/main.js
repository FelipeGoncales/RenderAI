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

// Função para limpar o input de arquivo e resetar a interface
function cleanInput() {
    // Limpa o input de arquivo
    document.querySelector('#upload-image').value = '';

    // Se não houver arquivo, mostra o label de upload e esconde a div de preview
    $labelUploadImage.show();
    $divPreviewUploadImage.hide();
}

// Ao clicar no botão de limpar input
$('#clean-input').click(() => {
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
let prompt = `
    Transform this interior design sketch into a highly realistic modern bedroom render while preserving the exact room layout, furniture positioning, proportions, wardrobe placement, desk position, bed orientation, TV location, and window structure from the original image.
    The room should look like a real professional architectural visualization for a custom furniture project.
    Style:
    - Modern minimalist bedroom
    - Warm and cozy atmosphere
    - High-end planned furniture
    - Neutral color palette
    - Soft ambient lighting
    Materials:
    - Dark wood headboard panel
    - Matte beige sliding wardrobe
    - Dark gray desktop
    - Light wood flooring
    - White walls with subtle texture
    Lighting:
    - Warm LED ceiling lights
    - Natural light entering through the window
    - Soft shadows
    - Realistic reflections and global illumination
    Details:
    - Realistic bed fabric textures
    - Modern decorative elements
    - Slight depth of field
    - Ultra realistic architectural render
    - Photorealistic materials
    - Interior design visualization
    - Preserve the exact perspective from the original sketch
    Quality:
    - Ultra realistic
    - 4K interior render
    - Architectural visualization
    - Professional render quality
`;

// Variável global para armazenar a URL da imagem gerada
var generatedImageURL = null;

// Adicionar um evento de submit ao formulário
$form.submit(async (e) => {
    // Prevenir o comportamento padrão do formulário
    e.preventDefault();

    // Desabilitar o botão de gerar imagem para evitar múltiplos envios
    $('.generate-btn').prop('disabled', true);

    const $loadingScreen = $('.loading')

    // Obter a imagem selecionada no input de arquivo
    const image = $inputFile[0].files[0];

    if (!image) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    // Construir o FormData para enviar a imagem e o prompt
    const formData = new FormData();

    // Adicionar a imagem e o prompt ao FormData    
    formData.append('image', image);
    formData.append('prompt', prompt);

    // Mostra a tela de carregamento
    $loadingScreen.css('display', 'flex');

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
                const width = img.naturalWidth;
                const height = img.naturalHeight;

                const proportion = height / width;

                const divWidth = 500;

                const divHeight = divWidth * proportion;

                $('.img-generated').css({
                    'width': `${divWidth}px`,
                    'height': `${divHeight}px`,
                    'background-image': `url(${urlImage})`,
                    'background-size': 'cover',
                    'background-position': 'center'
                });

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
        error: (error) => {
            console.error('Error:', error);
        }
    })

    // Habilitar o botão de gerar imagem novamente
    $('.generate-btn').prop('disabled', false);
    
    $loadingScreen.hide();
})

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

    // Limpa o input de arquivo e reseta a interface
    cleanInput();

    // Esconde a seção de imagem gerada e mostra a seção de upload
    $('#sec-img-generated').hide();
    $('#sec-form').css('display', 'flex');

})