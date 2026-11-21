// ===== Menu do celular =====
const btnMenu = document.getElementById('btn-menu');
const btnFechar = document.getElementById('btn-fechar');
const menu = document.getElementById('mobile');
const overlay = document.getElementById('overlay-menu');

function abrirMenu() {
    menu.classList.add('abrir-menu');
    menu.setAttribute('aria-hidden', 'false');
    btnMenu.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-aberto');
    btnFechar.focus();
}

function fecharMenu() {
    menu.classList.remove('abrir-menu');
    menu.setAttribute('aria-hidden', 'true');
    btnMenu.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-aberto');
}

btnMenu.addEventListener('click', abrirMenu);
btnFechar.addEventListener('click', fecharMenu);
overlay.addEventListener('click', fecharMenu);
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('abrir-menu')) fecharMenu();
});

// ===== Cabeçalho muda ao rolar =====
const cabecalho = document.getElementById('cabecalho');
const aoRolar = () => cabecalho.classList.toggle('rolou', window.scrollY > 30);
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

// ===== Animação de aparecer ao rolar + link ativo no menu =====
if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.revelar').forEach(el => observador.observe(el));

    const linksMenu = document.querySelectorAll('.menu-PC a');
    const observadorSecoes = new IntersectionObserver(entradas => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                linksMenu.forEach(link => {
                    link.classList.toggle('ativo', link.getAttribute('href') === '#' + entrada.target.id);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => observadorSecoes.observe(s));
} else {
    document.documentElement.classList.add('sem-js');
}

// ===== Ano automático no rodapé =====
document.getElementById('ano').textContent = new Date().getFullYear();

// ===== Envio do formulário sem sair da página =====
const form = document.getElementById('form-contato');
const statusForm = document.getElementById('status-form');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Enviando...';
    statusForm.className = 'status-form';
    statusForm.textContent = '';

    try {
        const resposta = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        });
        if (!resposta.ok) throw new Error();
        form.reset();
        statusForm.classList.add('sucesso');
        statusForm.textContent = 'Mensagem enviada! Obrigado, em breve eu respondo. 😉';
    } catch {
        statusForm.classList.add('erro');
        statusForm.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
    } finally {
        botao.disabled = false;
        botao.textContent = 'Enviar';
    }
});
