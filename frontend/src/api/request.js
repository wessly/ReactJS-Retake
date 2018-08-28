const host = 'https://kletki.win:7443/api';

async function fetchAllEvents() {
    return await fetch(host +'/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function fetchOneEvent(id) {
    return await fetch(host +'/event/'+ id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function fetchAllEventsSchedule() {
    return await fetch(host +'/schedule', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

async function fetchAllEventsManage(userId, token) {
    return await fetch(host +'/manage', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        }
    });
}

async function createEvent(payload, token) {
    return await fetch(host +'/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token
        },
        body: JSON.stringify(payload)
    });
}

async function deleteEvent(id, token) {
    return await fetch(host +'/event/'+ id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token
        }
    });
}

async function editEvent(id, payload, userId, token) {
    return await fetch(host +'/event/'+ id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        },
        body: JSON.stringify(payload)
    });
}

async function updatePlayer(id, payload, userId, token) {
    return await fetch(host +'/player/'+ id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        },
        body: JSON.stringify(payload)
    });
}

async function updatePlayerGk(id, userId, token) {
    return await fetch(host +'/player/gk/'+ id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        }
    });
}

async function playerExist(event_id, player_email, token) {
    return await fetch(host +'/event/'+ event_id +'/player/'+ player_email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token
        }
    });
}

async function joinEvent(id, payload, token) {
    return await fetch(host +'/event/join/'+ id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token
        },
        body: JSON.stringify(payload)
    });
}

async function fetchUserInfo(email, token) {
    return await fetch(host +'/username/'+ email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token
        }
    });
}

async function invitePlayers(eventid, userId, token) {
    return await fetch(host +'/invite/event/'+ eventid, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        }
    });
}

async function fetchAllAdminEvents(userId, token) {
    return await fetch(host +'/panel/allEvents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        }
    });
}

async function deleteEventAdmin(id, userId, token) {
    return await fetch(host +'/panel/event/'+ id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'FirebaseToken': token,
            'UserId': userId
        }
    });
}

export { 
    fetchAllEvents, 
    fetchOneEvent, 
    fetchAllEventsSchedule, 
    fetchAllEventsManage, 
    createEvent, 
    deleteEvent, 
    editEvent, 
    updatePlayer, 
    updatePlayerGk, 
    invitePlayers, 
    playerExist, 
    joinEvent, 
    fetchUserInfo,
    fetchAllAdminEvents,
    deleteEventAdmin
}