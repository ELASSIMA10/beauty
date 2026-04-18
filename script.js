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

    // Logic for time slots
    const dateInput = document.getElementById('booking-date');
    const timeSlotsContainer = document.querySelector('.time-slots-container');
    const timeSlotsGrid = document.getElementById('time-slots');
    const selectedTimeInput = document.getElementById('selected-time');

    dateInput.addEventListener('change', (e) => {
        const date = e.target.value;
        if (date) {
            generateTimeSlots();
            timeSlotsContainer.style.display = 'block';
        } else {
            timeSlotsContainer.style.display = 'none';
        }
    });

    function generateTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        selectedTimeInput.value = '';
        const startTime = 10 * 60; // 10:00
        const endTime = 18 * 60; // 18:00
        
        for (let time = startTime; time <= endTime; time += 30) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = timeStr;
            
            // Randomly block some slots for the demonstration
            if (Math.random() < 0.25) {
                slot.classList.add('booked');
                slot.title = "Déjà réservé";
            } else {
                slot.addEventListener('click', () => {
                    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                    slot.classList.add('selected');
                    selectedTimeInput.value = timeStr;
                });
            }
            timeSlotsGrid.appendChild(slot);
        }
    }

    // Form submission
    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!selectedTimeInput.value) {
            alert('Veuillez sélectionner un créneau horaire avant de valider.');
            return;
        }

        const prestation = document.querySelector('select').value;
        const date = dateInput.value;
        const time = selectedTimeInput.value;
        const prenom = document.getElementById('prenom').value;
        const nom = document.getElementById('nom').value;
        const telephone = document.getElementById('telephone').value;
        
        // Save to localStorage
        const reservation = {
            id: Date.now(),
            prestation,
            date,
            time,
            nom: nom.toUpperCase(),
            prenom,
            telephone
        };

        let reservations = JSON.parse(localStorage.getItem('salon_reservations') || '[]');
        reservations.push(reservation);
        localStorage.setItem('salon_reservations', JSON.stringify(reservations));

        alert(`Parfait ${prenom} ! Votre réservation est confirmée pour le ${date} à ${time}.`);
        
        modal.style.display = 'none';
        form.reset();
        timeSlotsContainer.style.display = 'none';
    });
});
