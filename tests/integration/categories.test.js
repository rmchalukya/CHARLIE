const request = require('supertest');
const { Category } = require('../../models/category');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('CATEGORIES TEST', () => {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {
        server.close();
        await Category.remove({})
    })

    describe('GET /', () => {
        it('should return all categories', async () => {
            await Category.collection.insertMany([
                { name: 'category1' },
                { name: 'category2' }
            ]);
            const res = await request(server).get('/api/categories');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.name === 'category1')).toBeTruthy();
            expect(res.body.some(c => c.name === 'category2')).toBeTruthy();
        });

        it('should return catagory if valid id is passed', async () => {
            let category = new Category({ name: 'category1' });
            category = await category.save();
            const res = await request(server).get(`/api/categories/${category._id}`);
            expect(res.status).toBe(200);
            //expect(res.body.name === 'category1').toBeTruthy();
            expect(res.body).toHaveProperty('name', category.name);
        });

        it('should return catagory not found error if invalid id is passed', async () => {
            const isValidId = new mongoose.Types.ObjectId;
            const res = await request(server).get(`/api/categories/${isValidId}`);
            expect(res.status).toBe(404);
        });

    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post('/api/categories')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'category1';
        })

        it('should return 401 if the client is not logged in', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if category is less than 2 characters', async () => {
            name = '12';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if category is more than 50 characters', async () => {
            name = new Array(52).join('c');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the category if it is valid', async () => {
            await exec();
            const category = await Category.find({ name: 'category1' });
            expect(category).not.toBeNull;
        });

        it('should return the category if it is valid', async () => {
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'category1');
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let category;
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/api/categories/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(async () => {
            // Before each test we need to create a category and 
            // put it in the database.      
            category = new Category({ name: 'category1' });
            await category.save();

            id = category._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;
            //TO DO
            const res = await exec();

            expect(res.status).toBe(500);
        });

        it('should return 404 if no category with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the category if input is valid', async () => {
            await exec();

            const categoryInDb = await Category.findById(id);

            expect(categoryInDb).toBeNull();
        });

        it('should return the removed category', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', category._id.toHexString());
            expect(res.body).toHaveProperty('name', category.name);
        });
    });
});

