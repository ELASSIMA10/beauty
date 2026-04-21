document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('booking-modal');
    const bookBtns = document.querySelectorAll('.btn-book, .btn-secondary, .btn-primary');
    const closeBtn = document.querySelector('.close');

    // Smooth reveal animation for cards
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Modal Logic
    bookBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Logic for time and date defaults
    const dateInput = document.getElementById('booking-date');
    const arrivalTimeInput = document.getElementById('arrival-time');
    
    function setDefaults() {
        const now = new Date();
        dateInput.value = now.toISOString().split('T')[0];
        arrivalTimeInput.value = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    }

    setDefaults(); // Set when page loads

    // Reset defaults when opening modal
    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setDefaults();
        });
    });

    // Form submission
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
            alert('Veuillez sélectionner un créneau horaire avant de valider.');
            return;
        }

        const prestation = document.querySelector('select').value;
        const date = dateInput.value;
        const arrivalTime = document.getElementById('arrival-time').value;
        const departureTime = document.getElementById('departure-time').value;
        const prenom = document.getElementById('prenom').value;
        const nom = document.getElementById('nom').value;
        const telephone = document.getElementById('telephone').value;
        
        // Save to localStorage
        const reservation = {
            id: Date.now(),
            prestation,
            date,
            arrivalTime,
            departureTime,
            nom: nom.toUpperCase(),
            prenom,
            telephone
        };

        let reservations = JSON.parse(localStorage.getItem('salon_reservations') || '[]');
        reservations.push(reservation);
        localStorage.setItem('salon_reservations', JSON.stringify(reservations));

        alert(`Parfait ${prenom} ! Votre réservation est confirmée pour le ${date} (Arrivée: ${arrivalTime}).`);
        
        modal.style.display = 'none';
        form.reset();
        setDefaults();
    });
});
