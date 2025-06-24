document.addEventListener('DOMContentLoaded', () => {
    const guestForm = document.getElementById('guest-form');
    const guestList = document.getElementById('guest-list');
    const guestCounter = document.getElementById('guest-counter');
    let guests = JSON.parse(localStorage.getItem('guests')) || [];
    const MAX_GUESTS = 10;


    function init() {
        renderGuestList();
        updateGuestCounter();
    }


    guestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('guest-name');
        const categoryInput = document.getElementById('guest-category');
        
        const name = nameInput.value.trim();
        const category = categoryInput.value;
        
        if (!name) return;
        
        if (guests.length >= MAX_GUESTS) {
            showAlert('Guest list is full! (Max 10 guests)');
            return;
        }
        
        const newGuest = {
            id: Date.now(),
            name,
            category,
            attending: true,
            timestamp: new Date().toISOString()
        };
        
        guests.push(newGuest);
        saveToLocalStorage();
        renderGuestList();
        updateGuestCounter();
        
        
        nameInput.value = '';
        nameInput.focus();
    });


    function renderGuestList() {
        guestList.innerHTML = '';
        
        guests.forEach(guest => {
            const li = document.createElement('li');
            li.className = `guest-item ${guest.attending ? '' : 'not-attending'}`;
            li.dataset.id = guest.id;
            
            const formattedTime = new Date(guest.timestamp).toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit'
            });
            
            li.innerHTML = `
                <div class="guest-info">
                    <div class="guest-name">${guest.name}</div>
                    <div class="guest-meta">
                        <span class="guest-category category-${guest.category}">
                            ${guest.category.charAt(0).toUpperCase() + guest.category.slice(1)}
                        </span>
                        <span class="guest-time">Added: ${formattedTime}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn btn-rsvp ${guest.attending ? '' : 'not-attending'}">
                        ${guest.attending ? 'Attending' : 'Not Attending'}
                    </button>
                    <button class="btn btn-edit">Edit</button>
                    <button class="btn btn-delete">Remove</button>
                </div>
            `;
            
            guestList.appendChild(li);
        });
        
    
        document.querySelectorAll('.btn-rsvp').forEach(btn => {
            btn.addEventListener('click', toggleRSVP);
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', deleteGuest);
        });
        
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', editGuest);
        });
    }

    
    function toggleRSVP(e) {
        const guestId = e.target.closest('.guest-item').dataset.id;
        guests = guests.map(guest => {
            if (guest.id == guestId) {
                return {...guest, attending: !guest.attending};
            }
            return guest;
        });
        saveToLocalStorage();
        renderGuestList();
    }


    function deleteGuest(e) {
        const guestId = e.target.closest('.guest-item').dataset.id;
        guests = guests.filter(guest => guest.id != guestId);
        saveToLocalStorage();
        renderGuestList();
        updateGuestCounter();
    }


    function editGuest(e) {
        const guestItem = e.target.closest('.guest-item');
        const guestId = guestItem.dataset.id;
        const guest = guests.find(g => g.id == guestId);
        
        const newName = prompt('Edit guest name:', guest.name);
        if (newName && newName.trim() !== '') {
            guest.name = newName.trim();
            saveToLocalStorage();
            renderGuestList();
        }
    }

    function updateGuestCounter() {
        guestCounter.textContent = `Guests: ${guests.length}/${MAX_GUESTS}`;
    }


    function showAlert(message) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    function saveToLocalStorage() {
        localStorage.setItem('guests', JSON.stringify(guests));
    }

    init();
});