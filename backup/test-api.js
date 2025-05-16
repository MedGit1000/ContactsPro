// Script simple pour tester la connexion à l'API json-server
// Exécute ce script avec Node.js : node test-api.js

const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/contacts',
    method: 'GET',
    timeout: 5000,
};

const req = http.request(options, (res) => {
    console.log(`Statut: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            console.log('Données reçues:');
            console.log(JSON.parse(data));
            console.log('\nLa connexion à json-server fonctionne correctement!');
        } catch (e) {
            console.error('Erreur lors du parsing de la réponse:', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error(`Erreur de connexion à json-server: ${e.message}`);

    if (e.code === 'ECONNREFUSED') {
        console.error('\nLe serveur json-server ne semble pas être démarré.');
        console.error('Assurez-vous de démarrer json-server avec: npm run backend');
    }
});

req.on('timeout', () => {
    console.error('La requête a expiré. Le serveur ne répond pas dans le délai imparti.');
    req.destroy();
});

console.log('Test de connexion à json-server (http://localhost:3000/contacts)...');
req.end();