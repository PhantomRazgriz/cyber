/**
 * awakening-sequence.js - Implementa una sequenza di dichiarazioni provocatorie 
 * per "risvegliare" i visitatori prima di mostrare il sito principale
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dichiarazioni d'impatto per risvegliare la coscienza
    const statements = [
        {
            text: "La tecnologia non è al <span class='statement-highlight'>tuo</span> servizio. <span class='statement-danger'>Tu</span> sei al servizio della tecnologia.",
            duration: 7000
        },
        {
            text: "Le tue <span class='statement-highlight'>notifiche</span> sono <span class='statement-danger glitch-effect' data-text='catene'>catene</span> che indossi volontariamente.",
            duration: 7000
        },
        {
            text: "Ti <span class='statement-highlight'>connetti</span> con mille persone mentre <span class='statement-danger'>perdi la connessione</span> con te stesso.",
            duration: 7000
        },
        {
            text: "Ogni <span class='statement-highlight'>click</span> che fai alimenta il sistema che ti <span class='statement-danger'>controlla</span>.",
            duration: 7000
        },
        {
            text: "La tua <span class='statement-highlight'>attenzione</span> è stata <span class='statement-danger'>hackerata</span>. È tempo di riprendertela.",
            duration: 7000
        },
        {
            text: "Non stai <span class='statement-highlight'>navigando</span> liberamente. Stai seguendo un <span class='statement-danger'>percorso programmato</span>.",
            duration: 7000
        },
        {
            text: "Gli <span class='statement-highlight'>algoritmi</span> non ti conoscono. Ti <span class='statement-danger'>costruiscono</span>.",
            duration: 7000
        },
        {
            text: "Ogni <span class='statement-highlight'>servizio gratuito</span> rende <span class='statement-danger'>te</span> il prodotto.",
            duration: 7000
        },
        {
            text: "La tua <span class='statement-highlight'>identità digitale</span> è una <span class='statement-danger'>merce</span> che viene venduta al miglior offerente.",
            duration: 7000
        },
        {
            text: "<span class='statement-highlight'>Quanto tempo fa</span> hai vissuto una giornata senza guardare uno <span class='statement-danger'>schermo</span>?",
            duration: 7000
        },
        {
            text: "È ora di <span class='statement-highlight'>svegliarsi</span> e riprendere il <span class='statement-danger'>controllo</span>.",
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
                
                // Mostra notifica di benvenuto
                if (typeof showNotification === 'function') {
                    showNotification('[INIZIALIZZAZIONE] Sistema La Veglia avviato. Risveglio in corso...');
                }
            }, 1000);
        }, 200);
    }

    // Avvia la sequenza di risveglio
    startAwakeningSequence();
});