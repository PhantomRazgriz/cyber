document.addEventListener('DOMContentLoaded', function() {
    // Effetto glitch casuale su elementi specifici
    const glitchElements = document.querySelectorAll('.logo, .hero h1 .highlight');
    glitchElements.forEach(element => {
        // Applica l'effetto glitch in modo casuale
        setInterval(() => {
            if (Math.random() > 0.9) { // 10% di probabilità
                element.style.clipPath = `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)`;
                element.style.transform = `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)`;
                
                setTimeout(() => {
                    element.style.clipPath = 'none';
                    element.style.transform = 'none';
                }, 200);
            }
        }, 3000);
    });

    // Contatore incrementale per giorni di controllo mentale
    const counterElement = document.getElementById('counter-days');
    if (counterElement) {
        const baseValue = 8421;
        let currentValue = baseValue;
        
        // Incrementa il contatore ogni 10 secondi (simulato)
        setInterval(() => {
            currentValue++;
            counterElement.textContent = currentValue.toLocaleString();
            
            // Aggiungi un effetto flash quando il contatore cambia
            counterElement.style.color = 'white';
            counterElement.style.textShadow = '0 0 10px var(--neon-red)';
            
            setTimeout(() => {
                counterElement.style.color = 'var(--neon-red)';
                counterElement.style.textShadow = 'none';
            }, 500);
        }, 10000);
    }

    // Effetto terminale di digitazione
    const terminalLines = document.querySelectorAll('.terminal p');
    terminalLines.forEach((line, index) => {
        const originalText = line.textContent;
        line.textContent = '';
        
        // Ritardo in base all'indice della linea
        setTimeout(() => {
            let i = 0;
            const typingEffect = setInterval(() => {
                if (i < originalText.length) {
                    line.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 30);
        }, index * 1000);
    });

    // Notifica per sottoscrizione newsletter
    const subscribeBtn = document.getElementById('subscribe-btn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const notificationClose = document.getElementById('notification-close');

    if (subscribeBtn && notification && notificationMessage && notificationClose) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = document.querySelector('.form-container input');
            
            if (emailInput && emailInput.value) {
                notificationMessage.textContent = '[CONNESSIONE STABILITA] Ti sei unito alla resistenza. Attendere istruzioni.';
                notification.classList.add('show');
                
                // Reset del campo email
                emailInput.value = '';
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 5000);
            } else {
                notificationMessage.textContent = '[ERRORE] Inserire indirizzo valido per connessione sicura.';
                notification.classList.add('show');
                
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
        });
        
        notificationClose.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }

    // Distorsione degli elementi al passaggio del mouse
    const distortElements = document.querySelectorAll('.card, .step');
    distortElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.2)';
            
            // Aggiungi un effetto bordo al passaggio del mouse
            const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');
            this.style.borderColor = borderColor;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'none';
            this.style.boxShadow = 'none';
            this.style.borderColor = '#222'; // Ripristina il colore originale del bordo
        });
    });

    // Messaggi criptici che appaiono casualmente
    const crypticMessages = [
        "Sei monitorato.",
        "I tuoi dati sono merce.",
        "Riconnettiti con la realtà.",
        "Spegni. Respira. Esisti.",
        "Le corporazioni controllano la narrativa.",
        "Il sistema non è rotto, è stato progettato così.",
        "La tua attenzione è la risorsa più preziosa."
    ];
    
    // Crea un elemento per i messaggi criptici
    const crypticElement = document.createElement('div');
    crypticElement.style.position = 'fixed';
    crypticElement.style.fontFamily = 'Share Tech Mono, monospace';
    crypticElement.style.fontSize = '0.8rem';
    crypticElement.style.color = 'rgba(255, 0, 255, 0.7)';
    crypticElement.style.padding = '5px 10px';
    crypticElement.style.zIndex = '5';
    crypticElement.style.opacity = '0';
    crypticElement.style.transition = 'opacity 0.5s ease';
    crypticElement.style.pointerEvents = 'none'; // Evita che il messaggio interferisca con l'interazione
    document.body.appendChild(crypticElement);
    
    // Funzione per mostrare messaggi random
    function showRandomMessage() {
        if (Math.random() > 0.7) { // 30% di probabilità
            const randomMessage = crypticMessages[Math.floor(Math.random() * crypticMessages.length)];
            const randomX = Math.floor(Math.random() * (window.innerWidth - 200));
            const randomY = Math.floor(Math.random() * (window.innerHeight - 50));
            
            crypticElement.textContent = randomMessage;
            crypticElement.style.left = randomX + 'px';
            crypticElement.style.top = randomY + 'px';
            crypticElement.style.opacity = '1';
            
            // Far scomparire il messaggio dopo un tempo random
            setTimeout(() => {
                crypticElement.style.opacity = '0';
            }, Math.random() * 3000 + 2000); // 2-5 secondi
        }
        
        // Pianifica il prossimo messaggio
        setTimeout(showRandomMessage, Math.random() * 20000 + 10000); // 10-30 secondi
    }
    
    // Avvia la sequenza di messaggi
    setTimeout(showRandomMessage, 5000); // Inizia dopo 5 secondi

    // Effetto scan line aggiuntivo
    const scanLines = document.querySelectorAll('.scan-line');
    if (scanLines.length === 1) {
        // Aggiungi altre scan line con diverse velocità per un effetto più ricco
        for (let i = 0; i < 2; i++) {
            const newScanLine = document.createElement('div');
            newScanLine.className = 'scan-line';
            newScanLine.style.opacity = '0.1';
            newScanLine.style.height = '1px';
            newScanLine.style.animationDuration = `${8 + i * 3}s`; // Velocità diverse
            document.body.appendChild(newScanLine);
        }
    }

    // Effetto pulsante terminal blink
    const terminalBlink = document.querySelector('.terminal-blink');
    if (terminalBlink) {
        setInterval(() => {
            terminalBlink.style.opacity = terminalBlink.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    // Aggiunge un effetto di distorsione al passaggio del mouse sul titolo principale
    const mainTitle = document.querySelector('.hero h1');
    if (mainTitle) {
        mainTitle.addEventListener('mouseover', function() {
            this.style.textShadow = '0 0 15px var(--neon-blue), 0 0 30px var(--neon-blue)';
            
            // Piccola distorsione del testo
            this.style.letterSpacing = '2px';
            this.style.transform = 'scale(1.02)';
            
            // Aggiungi un leggero shift di colore
            const highlights = this.querySelectorAll('span');
            highlights.forEach(span => {
                span.style.color = 'var(--neon-pink)';
            });
        });
        
        mainTitle.addEventListener('mouseout', function() {
            this.style.textShadow = '';
            this.style.letterSpacing = '';
            this.style.transform = '';
            
            // Ripristina i colori originali
            const normalSpans = this.querySelectorAll('span:not(.highlight)');
            const highlightSpans = this.querySelectorAll('.highlight');
            
            normalSpans.forEach(span => {
                span.style.color = 'var(--neon-blue)';
            });
            
            highlightSpans.forEach(span => {
                span.style.color = 'var(--neon-red)';
            });
        });
    }

    // Aggiunge un sottile effetto di parallasse allo sfondo
    window.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.body.style.backgroundPosition = `${x * 20}px ${y * 20}px`;
    });
});