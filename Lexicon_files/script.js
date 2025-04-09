document.addEventListener('DOMContentLoaded', () => {
    const newWordInput = document.getElementById('new-word-input');
    const alphabetNav = document.querySelector('.alphabet-navigation');
    const wordList = document.getElementById('word-list');
    const currentLetterHeading = document.getElementById('current-letter');
    const searchInput = document.getElementById('search-input');

    let lexicon = JSON.parse(localStorage.getItem('lexicon')) || {};
    let selectedLetter = null;

    // --- Initialization ---

    function initialize() {
        generateAlphabetLinks();
        displayWords();
        highlightActiveLetter();
        searchInput.value = ''; // Clear search input on initialization
    }

    // --- Word Management ---

    // Update your addWord function to be more explicit about success
    function addWord() {
        const word = newWordInput.value.trim();
        if (word === "") {
            alert("Please enter a word.");
            return;
        }

        const firstLetter = word.charAt(0).toUpperCase();
        if (!lexicon[firstLetter]) {
            lexicon[firstLetter] = [];
        }

        // Avoid duplicates within the same letter
        if (!lexicon[firstLetter].includes(word)) {
            lexicon[firstLetter].push(word);
            lexicon[firstLetter].sort(); // Keep the list sorted
            saveLexicon();
            newWordInput.value = ''; // Clear input
            
            // Update display
            if (selectedLetter === firstLetter) {
                displayWords(selectedLetter);
            } else if (selectedLetter === null) {
                displayWords();
            }
            
            // Update alphabet if needed
            if (lexicon[firstLetter].length === 1) {
                generateAlphabetLinks();
                highlightActiveLetter();
            }
        } else {
            alert(`"${word}" is already in the lexicon under letter ${firstLetter}.`);
        }
    }

    // Add this function before removeWord
    function showDeleteConfirmation(word, onConfirm) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <p>Delete "${word}" from your lexicon?</p>
            <div class="confirm-dialog-buttons">
                <button class="cancel-delete">Cancel</button>
                <button class="confirm-delete">Delete</button>
            </div>
        `;

        // Add dialog to body
        document.body.appendChild(dialog);

        // Handle button clicks
        dialog.querySelector('.cancel-delete').addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });

        dialog.querySelector('.confirm-delete').addEventListener('click', () => {
            onConfirm();
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        });
    }

    function removeWord(word) {
        showDeleteConfirmation(word, () => {
            const firstLetter = word.charAt(0).toUpperCase();
            
            // Remove the word from lexicon
            lexicon[firstLetter] = lexicon[firstLetter].filter(w => w !== word);
            
            // If letter has no more words, remove the letter entry
            if (lexicon[firstLetter].length === 0) {
                delete lexicon[firstLetter];
                generateAlphabetLinks();
            }
            
            // Remove word data from localStorage
            localStorage.removeItem(`word_${word}`);
            
            // Save updated lexicon
            saveLexicon();
            
            // Close side view if open
            document.getElementById('side-view').classList.remove('open');
            
            // Refresh the display
            displayWords(selectedLetter);
        });
    }

    // --- Display Logic ---

    function displayWords(letter = null) {
        wordList.innerHTML = ''; // Clear current list
        selectedLetter = letter;
        highlightActiveLetter();

        if (letter) {
            currentLetterHeading.textContent = `Words starting with "${letter}"`;
            const words = lexicon[letter] || [];
            if (words.length === 0) {
                wordList.innerHTML = '<li>No words found for this letter.</li>';
            } else {
                words.forEach(word => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="word-text">${word}</span>
                        <button class="delete-word-btn" title="Delete word">×</button>
                    `;
                    
                    // Add click handlers
                    li.querySelector('.delete-word-btn').addEventListener('click', () => {
                        removeWord(word);
                    });
                    li.querySelector('.word-text').addEventListener('click', () => openSideView(word));
                    
                    wordList.appendChild(li);
                });
            }
        } else {
            // Display all words if no letter is selected
            currentLetterHeading.textContent = 'All Words';
            let allWords = [];
            Object.keys(lexicon).sort().forEach(key => {
                allWords = allWords.concat(lexicon[key]);
            });

            if (allWords.length === 0) {
                wordList.innerHTML = '<li>Your lexicon is empty. Add some words!</li>';
            } else {
                allWords.sort().forEach(word => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <span class="word-text">${word}</span>
                        <button class="delete-word-btn" title="Delete word">×</button>
                    `;
                    
                    // Add click handlers
                    li.querySelector('.delete-word-btn').addEventListener('click', () => {
                        removeWord(word);
                    });
                    li.querySelector('.word-text').addEventListener('click', () => openSideView(word));
                    
                    wordList.appendChild(li);
                });
            }
        }
    }

    function searchWords(query) {
        query = query.toLowerCase().trim();
        
        if (query === '') {
            displayWords(selectedLetter); // Show normal view if search is empty
            return;
        }

        wordList.innerHTML = ''; // Clear current list
        currentLetterHeading.textContent = `Search results for "${query}"`;
        
        let results = [];
        
        // Search through all words
        Object.values(lexicon).forEach(words => {
            words.forEach(word => {
                if (word.toLowerCase().includes(query)) {
                    results.push(word);
                }
            });
        });
        
        // Sort results alphabetically
        results.sort();
        
        if (results.length === 0) {
            wordList.innerHTML = '<li>No words found.</li>';
        } else {
            results.forEach(word => {
                const li = document.createElement('li');
                // Highlight the matching part
                const wordHtml = word.replace(new RegExp(query, 'gi'), match => `<span class="highlight">${match}</span>`);
                
                li.innerHTML = `
                    <span class="word-text">${wordHtml}</span>
                    <button class="delete-word-btn" title="Delete word">×</button>
                `;
                
                // Add click handlers
                li.querySelector('.delete-word-btn').addEventListener('click', () => {
                    removeWord(word);
                });
                li.querySelector('.word-text').addEventListener('click', () => openSideView(word));
                
                wordList.appendChild(li);
            });
        }
    }

    function generateAlphabetLinks() {
        alphabetNav.innerHTML = ''; // Clear existing links
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        // Add "All" link
        const allLink = document.createElement('a');
        allLink.textContent = 'All';
        allLink.href = '#';
        allLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayWords(null); // Pass null to show all words
        });
        alphabetNav.appendChild(allLink);


        alphabet.forEach(letter => {
            const link = document.createElement('a');
            link.textContent = letter;
            link.href = `#${letter}`;
            // Optionally disable links for letters with no words yet
            // if (!lexicon[letter] || lexicon[letter].length === 0) {
            //     link.style.opacity = '0.5';
            //     link.style.pointerEvents = 'none'; // Make it non-clickable
            // }
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                displayWords(letter);
            });
            alphabetNav.appendChild(link);
        });
         highlightActiveLetter(); // Re-apply active class after regenerating
    }

     function highlightActiveLetter() {
        const links = alphabetNav.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            // Check for 'All' link or specific letter link
            if ((selectedLetter === null && link.textContent === 'All') || (link.textContent === selectedLetter)) {
                link.classList.add('active');
            }
        });
    }

    function openSideView(word) {
        const sideView = document.getElementById('side-view');
        const sideViewWord = document.getElementById('side-view-word');
        const sideViewContent = document.getElementById('side-view-content');
        
        // Get stored data
        const wordData = JSON.parse(localStorage.getItem(`word_${word}`)) || {
            notes: ''
        };
        
        // Set the word as the title
        sideViewWord.textContent = word;
        
        // Create simplified content with just notes
        sideViewContent.innerHTML = `
            <div class="notes-section" contenteditable="true">${wordData.notes || ''}</div>
        `;

        // Add event listener for notes
        const notesSection = sideViewContent.querySelector('.notes-section');
        
        // Save notes when changed
        notesSection.addEventListener('input', () => {
            const currentData = JSON.parse(localStorage.getItem(`word_${word}`)) || {};
            currentData.notes = notesSection.innerHTML;
            localStorage.setItem(`word_${word}`, JSON.stringify(currentData));
        });
        
        // Open the side view
        sideView.classList.add('open');
    }

    // --- Utility Functions ---

    function saveLexicon() {
        localStorage.setItem('lexicon', JSON.stringify(lexicon));
    }

    // --- Event Listeners ---

    // Allow adding word by pressing Enter in the input field
    newWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWord();
        }
    });

    searchInput.addEventListener('input', (e) => {
        searchWords(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase().trim();
            const allWords = [];
            
            // Collect all words
            Object.values(lexicon).forEach(words => {
                allWords.push(...words);
            });
            
            // Find exact match or first word that includes the search term
            const matchedWord = allWords.find(word => 
                word.toLowerCase() === query || word.toLowerCase().includes(query)
            );
            
            if (matchedWord) {
                openSideView(matchedWord);
                searchInput.value = ''; // Clear search after opening
            }
        }
    });

    document.getElementById('close-side-view').addEventListener('click', () => {
        document.getElementById('side-view').classList.remove('open');
    });

    // --- Initial Load ---
    initialize();
});