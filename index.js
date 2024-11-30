const app = require('./app');
const db = require('./config/db');
const UserModel = require('./model/user.model');
const TripsModel = require('./model/tripD.model');

const port = 3000;

app.get('/', (req, res) => {
    res.send("malak jawabreh!");
});

app.listen(port, () => {
    console.log(`hello server listening on port http://localhost:${port}`);
});
