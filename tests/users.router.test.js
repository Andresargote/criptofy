const request = require('supertest');

const { app } = require('../index');
const User = require('../database/models/user.model');

const testUsers = [
    {
        email: "andrestest@gmail.com",
        password: "123456789andresTest",
        username: "andresTest",
    },
    {
        email: "andrestest1@gmail.com",
        password: "123456789andresTest",
        username: "andresTest1"
    },
    {
        email: "andrestest2@gmail.com",
        password: "123456789andresTest",
        username: "andresTest2"
    }
];

const userExists = (user, done) => {
    User.find({ username: user.username })
        .then(users => {
            expect(users).toBeInstanceOf(Array)
            expect(users).toHaveLength(1)
            expect(users[0].username).toEqual(user.username)
            // expect(users[0].email).toEqual(user.email) -> Yo por seguridad de mi API no regreso el email

            /* const equalsPasswords = bcrypt.compareSync(user.password, users[0].password);
            expect(equalsPasswords).toBeTruthy() */
            done();
        })
        .catch(err => {
            done(err)
        })
};

describe('Users', () => {

    beforeEach((done) => {
        // borramos todos los usuarios
        User.deleteMany({}, (err) => {
            done();
        });
    });

    describe('GET/api/v1/users', () => {

        test('If there is no user it must return an empty array', (done) => {
            request(app)
                .get('/api/v1/users')
                .end((err, res) => {
                    expect(res.status).toBe(200)
                    expect(res.body).toBeInstanceOf(Array)
                    expect(res.body).toHaveLength(0)
                    done()
                });
        });

        //cuando obtengamos el response deberiamos de validar la estructura del body
        test('If there are users it should return them in an array.', (done) => {
            Promise.all(testUsers.map(user => (new User(user).save())))
                .then(users => {
                    request(app)
                        .get('/api/v1/users')
                        .end((err, res) => {
                            expect(res.status).toBe(200)
                            expect(res.body).toBeInstanceOf(Array)
                            expect(res.body).toHaveLength(3)
                            done()
                        });
                })
        });

    });

    describe('POST/api/v1/users/register', () => {

        test('A user who meets all the conditions must be created', (done) => {
            request(app)
                .post('/api/v1/users/register')
                .send({ username: 'Andres15', email: 'andres15@gmail.com', password: '12345678' })
                .end((err, res) => {
                    expect(res.status).toBe(201)
                    expect(res.body).toBeInstanceOf(Object)
                    userExists(res.body, done);
                });
        });

        test('It should not be possible to create a user with a repeated email address', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    email: "andrestest@gmail.com", 
                    password: "123456789andresTest", 
                    username: "andresTest4", 
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('That email is not valid') 
                    done() 
                }) 
            }) 
        });

        test('It should not be possible to create a user with a repeated username', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    email: "andrestest4@gmail.com", 
                    password: "123456789andresTest", 
                    username: "andresTest", 
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('That username is not available') 
                    done() 
                }) 
            }) 
        });

        test('A user without email should not be created', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    password: "123456789andresTest", 
                    username: "andresTest", 
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('\"email\" is required') 
                    done() 
                }) 
            }) 
        });

        test('A user without username should not be created', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    email: "andresargote777@gmail.com",
                    password: "123456789andresTest", 
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('\"username\" is required') 
                    done() 
                }) 
            }) 
        });

        test('A user without password should not be created', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    username: "andres777",
                    email: "andresargote777@gmail.com"
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('\"password\" is required') 
                    done() 
                }) 
            }) 
        });

        test('A user with a password shorter than 8 characters should not be created', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    username: "andres777",
                    email: "andresargote777@gmail.com",
                    password: "1234567"
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('\"password\" length must be at least 8 characters long') 
                    done() 
                }) 
            }) 
        });

        test('A user with a username longer than 30 characters should not be created', (done) => { 
            Promise.all(testUsers.map(user => (new User(user).save()))) 
            .then(users => { 
                request(app) 
                .post('/api/v1/users/register') 
                .send({ 
                    username: "dkxwxvfhxqneremqbypquyjmqwbvdxw",
                    email: "andresargote777@gmail.com",
                    password: "1234567"
                }) 
                .end((err, res) => { 
                    expect(res.status).toBe(400) 
                    expect(res.body.message).toMatch('\"username\" length must be less than or equal to 30 characters long') 
                    done() 
                }) 
            }) 
        });
    });
});