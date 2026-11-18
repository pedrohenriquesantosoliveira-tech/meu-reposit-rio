document.addEventListener('DOMContentLoaded', () => {
  /* =================================================================
     1. PÁGINA DE ABERTURA (SPLASH SCREEN COM EFEITO DE DIGITAÇÃO)
     ================================================================= */
  const splashScreen = document.getElementById('splash-screen');
  const typewriterEl = document.getElementById('splash-typewriter');
  const progressBar = document.getElementById('splash-progress');
  const enterBtn = document.getElementById('enter-portfolio-btn');
  const portfolioWrapper = document.getElementById('portfolio-wrapper');

  const introText = 'Desenvolvedor Front-End • UCSAL Salvador';
  let charIndex = 0;

  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 150);

  function typeWriter() {
    if (charIndex < introText.length) {
      typewriterEl.textContent += introText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 35);
    } else {
      enterBtn.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    }
  }
  setTimeout(typeWriter, 300);

  enterBtn.addEventListener('click', () => {
    splashScreen.style.opacity = '0';
    splashScreen.style.transform = 'scale(1.08)';
    splashScreen.style.pointerEvents = 'none';

    setTimeout(() => {
      splashScreen.style.display = 'none';
      portfolioWrapper.classList.remove('opacity-0', 'scale-95');
      triggerScrollReveal();
    }, 800);
  });

  /* =================================================================
     2. FUNDO INTERATIVO 3D (CONSTELAÇÃO DE PARTÍCULAS NO CANVAS)
     ================================================================= */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = 'rgba(96, 165, 250, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 85);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 - dist / 750})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dxMouse = particles[i].x - mouse.x;
        const dyMouse = particles[i].y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < mouse.radius) {
          ctx.strokeStyle = `rgba(129, 140, 248, ${0.35 - distMouse / 400})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* =================================================================
     3. MOTOR 3D TILT REAL + REFLEXO DE LUZ (GLARE) NOS CARDS
     ================================================================= */
  const tiltCards = document.querySelectorAll('.js-tilt-card');

  tiltCards.forEach((card) => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.18) 0%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (glare) {
        glare.style.opacity = '0';
      }
    });
  });

  /* =================================================================
     4. CARROSSEL INTERATIVO DE PROJETOS
     ================================================================= */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');
  const carouselProgress = document.getElementById('carousel-progress');
  const slides = Array.from(track.children);

  let currentSlide = 0;
  const slideDuration = 6000;
  let slideTimer;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `h-2 rounded-full transition-all duration-300 ${index === 0 ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}`;
    dot.setAttribute('aria-label', `Ir para projeto ${index + 1}`);
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetCarouselTimer();
    });
    indicatorsContainer.appendChild(dot);
  });

  function updateCarouselUI() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    Array.from(indicatorsContainer.children).forEach((dot, idx) => {
      dot.className = idx === currentSlide
        ? 'h-2 w-8 rounded-full bg-blue-500 transition-all duration-300'
        : 'h-2 w-2 rounded-full bg-slate-700 hover:bg-slate-500 transition-all duration-300';
    });

    carouselProgress.style.transition = 'none';
    carouselProgress.style.width = '0%';
    setTimeout(() => {
      carouselProgress.style.transition = `width ${slideDuration}ms linear`;
      carouselProgress.style.width = '100%';
    }, 50);
  }

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    updateCarouselUI();
  }

  function resetCarouselTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideDuration);
  }

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetCarouselTimer();
  });

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetCarouselTimer();
  });

  updateCarouselUI();
  resetCarouselTimer();

  /* =================================================================
     5. REVELAÇÃO SUAVE AO ROLAR A PÁGINA (SCROLL REVEAL)
     ================================================================= */
  function triggerScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach((el) => observer.observe(el));
  }

  /* =================================================================
     6. COPIAR E-MAIL COM FEEDBACK VISUAL
     ================================================================= */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailLabel = document.getElementById('email-label');

  copyEmailBtn.addEventListener('click', () => {
    const email = 'pedrohenriquesantos.oliveira@ucsal.edu.br';
    navigator.clipboard.writeText(email);

    emailLabel.textContent = '✓ E-mail copiado com sucesso!';
    copyEmailBtn.classList.add('border-emerald-500', 'text-emerald-400');

    setTimeout(() => {
      emailLabel.textContent = email;
      copyEmailBtn.classList.remove('border-emerald-500', 'text-emerald-400');
    }, 2500);
  });

  /* =================================================================
     7. FORMULÁRIO DE DÚVIDAS & INTERESSES (ENVIO HÍBRIDO GARANTIDO)
     ================================================================= */
  const interestChips = document.querySelectorAll('.interest-chip');
  const interestInput = document.getElementById('sender-interest');
  const messageTextarea = document.getElementById('sender-message');
  const charCounter = document.getElementById('char-counter');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-form-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtnIcon = document.getElementById('submit-btn-icon');
  const formStatus = document.getElementById('form-status');

  // Seleção dos chips de interesse
  interestChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      interestChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      interestInput.value = chip.dataset.value;
    });
  });

  // Contador de caracteres em tempo real
  messageTextarea.addEventListener('input', () => {
    charCounter.textContent = `${messageTextarea.value.length} / 500`;
  });

  // Função auxiliar para abrir o cliente de e-mail como fallback garantido
  function abrirClienteEmail(destino, assunto, corpo) {
    window.location.href = `mailto:${destino}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const destino = 'pedrohenriquesantos.oliveira@ucsal.edu.br';
    const interesse = interestInput.value;
    const nome = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const mensagem = messageTextarea.value.trim();

    const assunto = `[Portfólio - ${interesse}] Contato de ${nome}`;
    const corpoEmail = `Interesse: ${interesse}\nNome: ${nome}\nE-mail para resposta: ${email}\n\nMensagem:\n${mensagem}`;

    // Se estiver rodando localmente via file://, abre direto o app de e-mail sem erro de CORS
    if (window.location.protocol === 'file:') {
      formStatus.textContent = '✓ Abrindo seu aplicativo de e-mail com a mensagem preenchida...';
      formStatus.className = 'p-4 rounded-xl text-sm font-medium text-center border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 block';
      abrirClienteEmail(destino, assunto, corpoEmail);
      contactForm.reset();
      charCounter.textContent = '0 / 500';
      return;
    }

    // Em servidor HTTP (Live Server ou Vercel), tenta envio assíncrono via FormSubmit
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    submitBtnText.textContent = 'ENVIANDO MENSAGEM...';
    submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
    formStatus.classList.add('hidden');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${destino}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: assunto,
          _captcha: 'false',
          Interesse: interesse,
          Nome: nome,
          Email: email,
          Mensagem: mensagem
        })
      });

      if (response.ok) {
        formStatus.textContent = '✓ Mensagem enviada com sucesso para o e-mail de Pedro!';
        formStatus.className = 'p-4 rounded-xl text-sm font-medium text-center border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 block';
        contactForm.reset();
        charCounter.textContent = '0 / 500';
      } else {
        throw new Error('Fallback para mailto');
      }
    } catch (error) {
      // Fallback automático caso o FormSubmit não esteja ativado ou haja bloqueio de rede
      formStatus.textContent = '✓ Redirecionando para o seu aplicativo de e-mail com a mensagem pronta...';
      formStatus.className = 'p-4 rounded-xl text-sm font-medium text-center border bg-blue-500/10 border-blue-500/30 text-blue-300 block';
      abrirClienteEmail(destino, assunto, corpoEmail);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      submitBtnText.textContent = 'ENVIAR PARA O E-MAIL DE PEDRO';
      submitBtnIcon.className = 'fa-solid fa-paper-plane';
    }
  });
});