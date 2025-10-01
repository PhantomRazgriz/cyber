/**
 * awakening-sequence.js - Implements a sequence of provocative statements
 * to "awaken" visitors before showing the main site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Impact statements to awaken consciousness
    const statements = [
        {
            text: "Technology is not at <span class='statement-highlight'>your</span> service. <span class='statement-danger'>You</span> are at the service of technology.",
            duration: 7000
        },
        {
            text: "Your <span class='statement-highlight'>notifications</span> are <span class='statement-danger glitch-effect' data-text='chains'>chains</span> that you wear voluntarily.",
            duration: 7000
        },
        {
            text: "You <span class='statement-highlight'>connect</span> with a thousand people while <span class='statement-danger'>losing connection</span> with yourself.",
            duration: 7000
        },
        {
            text: "Every <span class='statement-highlight'>click</span> you make feeds the system that <span class='statement-danger'>controls</span> you.",
            duration: 7000
        },
        {
            text: "Your <span class='statement-highlight'>attention</span> has been <span class='statement-danger'>hacked</span>. It's time to take it back.",
            duration: 7000
        },
        {
            text: "You're not <span class='statement-highlight'>browsing</span> freely. You're following a <span class='statement-danger'>programmed path</span>.",
            duration: 7000
        },
        {
            text: "<span class='statement-highlight'>Algorithms</span> don't know you. They <span class='statement-danger'>build</span> you.",
            duration: 7000
        },
        {
            text: "Every <span class='statement-highlight'>free service</span> makes <span class='statement-danger'>you</span> the product.",
            duration: 7000
        },
        {
            text: "Your <span class='statement-highlight'>digital identity</span> is a <span class='statement-danger'>commodity</span> sold to the highest bidder.",
            duration: 7000
        },
        {
            text: "<span class='statement-highlight'>How long ago</span> did you live a day without looking at a <span class='statement-danger'>screen</span>?",
            duration: 7000
        },
        {
            text: "It's time to <span class='statement-highlight'>wake up</span> and regain <span class='statement-danger'>control</span>.",
            duration: 8000,
            final: true
        }
    ];

    let currentStatementIndex = 0;
    let skipSequence = false;

    // Crea l'overlay di risveglio
    function createAwakeningOverlay() {
        const overlayHTML = `
            <div class="awakening-overlay">
                <div class="statement-container">
                    <div class="scan-line-effect"></div>
                    <div class="noise-effect"></div>
                    <div class="static-flash"></div>
                    <div class="electric-shock"></div>
                    <button class="enter-button">ENTRA NEL SISTEMA</button>
                    <div class="statement-counter">1/${statements.length}</div>
                    <button class="skip-button">SALTA SEQUENZA</button>
                </div>
            </div>
        `;
        
        // Inserisci l'HTML all'inizio del body
        document.body.insertAdjacentHTML('afterbegin', overlayHTML);
        
        // Inizializza listeners
        document.querySelector('.skip-button').addEventListener('click', skipAwakeningSequence);
        document.querySelector('.enter-button').addEventListener('click', enterSystem);
    }

    // Avvia la sequenza di risveglio
    function startAwakeningSequence() {
        createAwakeningOverlay();
        showNextStatement();
        
        // Aggiunge effetto di scanning occasionale
        setInterval(() => {
            if (Math.random() > 0.7 && !skipSequence) {
                const staticFlash = document.querySelector('.static-flash');
                staticFlash.style.animation = 'staticFlash 0.5s forwards';
                
                setTimeout(() => {
                    staticFlash.style.animation = '';
                }, 500);
            }
        }, 3000);
    }

    // Mostra la prossima dichiarazione
    function showNextStatement() {
        if (skipSequence) return;
        
        const statementContainer = document.querySelector('.statement-container');
        const counter = document.querySelector('.statement-counter');
        
        // Aggiorna il contatore
        counter.textContent = `${currentStatementIndex + 1}/${statements.length}`;
        
        // Ottieni la dichiarazione corrente
        const statement = statements[currentStatementIndex];
        
        // Rimuovi eventuali dichiarazioni precedenti
        const oldStatements = document.querySelectorAll('.statement');
        oldStatements.forEach(old => {
            old.classList.add('exit');
            setTimeout(() => {
                old.remove();
            }, 800);
        });
        
        // Crea il nuovo elemento della dichiarazione
        const statementElement = document.createElement('div');
        statementElement.className = 'statement';
        statementElement.innerHTML = statement.text;
        statementContainer.appendChild(statementElement);
        
        // Attiva con un piccolo ritardo per far partire l'animazione
        setTimeout(() => {
            statementElement.classList.add('active');
            
            // Aggiungi effetto di "shock" elettrico
            if (currentStatementIndex > 0 && currentStatementIndex < statements.length - 1) {
                const shock = document.querySelector('.electric-shock');
                shock.style.opacity = '0.7';
                setTimeout(() => {
                    shock.style.opacity = '0';
                }, 100);
            }
            
            // Se è l'ultima dichiarazione, mostra il pulsante ENTRA
            if (statement.final) {
                setTimeout(() => {
                    document.querySelector('.enter-button').classList.add('show');
                }, 2000);
            } else {
                // Altrimenti, programma la prossima dichiarazione
                setTimeout(() => {
                    currentStatementIndex++;
                    if (currentStatementIndex < statements.length) {
                        showNextStatement();
                    }
                }, statement.duration);
            }
        }, 100);
    }

    // Salta la sequenza di risveglio
    function skipAwakeningSequence() {
        skipSequence = true;
        
        // Mostra immediatamente l'ultima dichiarazione
        currentStatementIndex = statements.length - 1;
        
        // Rimuovi tutte le dichiarazioni attuali
        const oldStatements = document.querySelectorAll('.statement');
        oldStatements.forEach(old => {
            old.remove();
        });
        
        // Aggiorna il contatore
        const counter = document.querySelector('.statement-counter');
        counter.textContent = `${statements.length}/${statements.length}`;
        
        // Mostra l'ultima dichiarazione
        const statementContainer = document.querySelector('.statement-container');
        const statementElement = document.createElement('div');
        statementElement.className = 'statement active';
        statementElement.innerHTML = statements[currentStatementIndex].text;
        statementContainer.appendChild(statementElement);
        
        // Mostra il pulsante ENTRA
        document.querySelector('.enter-button').classList.add('show');
    }

    // Entra nel sistema principale
    function enterSystem() {
        // Aggiungi un ultimo effetto flash
        const shock = document.querySelector('.electric-shock');
        shock.style.opacity = '1';
        
        // Fade out dell'overlay
        setTimeout(() => {
            document.querySelector('.awakening-overlay').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.awakening-overlay').remove();
                
                // Attiva effetto Cyber Grid
                if (window.cyberGrid) {
                    window.cyberGrid.triggerBurst();
                }
                
                // Show welcome notification
                if (typeof showNotification === 'function') {
                    showNotification('[INITIALIZATION] The Awakening System started. Awakening in progress...');
                }
            }, 1000);
        }, 200);
    }

    // Start the awakening sequence
    startAwakeningSequence();
});