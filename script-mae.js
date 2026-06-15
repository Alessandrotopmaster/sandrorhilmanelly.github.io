// Script para interatividade do site

document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');
    
    // Adicionar animação aos cards quando carregam
    const cards = document.querySelectorAll('.projeto-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });

    // Adicionar efeito de ripple aos botões
    const buttons = document.querySelectorAll('.btn, .btn-voltar');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Scroll smooth para links internos
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Atualizar ano do copyright dinamicamente
    const year = new Date().getFullYear();
    const footers = document.querySelectorAll('footer p');
    footers.forEach(footer => {
        if (footer.textContent.includes('©')) {
            footer.textContent = `© ${year} - Alessandrotopmaster. Todos os direitos reservados.`;
        }
    });

    // Log para debug
    console.log('Scripts carregados: Animações, ripple e smooth scroll');
});

// Função para voltar à página anterior
function voltarPagina() {
    window.history.back();
}

// Função para abrir link em nova aba
function abrirNovaAba(url) {
    window.open(url, '_blank');
}

// Service Worker registration para PWA (offline)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso!');
        })
        .catch(error => {
            console.log('Erro ao registrar Service Worker:', error);
        });
}
