import supertest from "supertest";
import app from "./backend.js";
import { initDatabase, closeDatabase } from "./backend.js";
import e from "express";

beforeAll(() => {
    return initDatabase();
});
afterAll(() => {
    return closeDatabase();
    done();
});

let token = "Bearer ";
let id;

// test signup
describe("POST /signup", () => {
    describe("given a username and password", () => {
        test("it responds with a 201 status code", async () => {
            const response = await supertest(app).post("/signup").send({
                name: "test",
                username: "test",
                email: "test@gmail.com",
                password: "123456789",
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("token");
            token += response.body.token;
        });
    });
    describe("given a missing username", () => {
        test("it responds with a 400 status code", async () => {
            const response = await supertest(app).post("/signup").send({
                name: "test",
                username: "test",
                password: "123456789",
            });
            expect(response.status).toBe(400);
        });
    });
});

// test login
describe("POST /login", () => {
    describe("given a username and password", () => {
        test("it responds with a 200 status code", async () => {
            const response = await supertest(app).post("/login").send({
                username: "test",
                password: "123456789",
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
        });
    });
    describe("given a missing username", () => {
        test("it responds with a 400 status code", async () => {
            const response = await supertest(app).post("/login").send({
                password: "123456789",
            });
            expect(response.status).toBe(400);
        });
    });
});

// get all users
describe("GET ALL users", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get("/user")
            .set("Authorization", token);
        expect(response.status).toBe(200);
    });
});

// get user by username
describe("GET user by usernames", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get("/user")
            .query({ username: "test" })
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe("test");
        id = response.body._id;
    });
});

// // Get user by email address
describe("GET user by email", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get("/user")
            .query({ email: "test@gmail.com" })
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe("test");
        expect(response.body._id).toBe(id);
    });
});

// add a task to a user
describe("POST /users/:id/task", () => {
    test("it responds with a 201 status code", async () => {
        const response = await supertest(app)
            .post(`/users/${id}/task`)
            .send({
                name: "test task",
                description: "test description",
                time: 20,
            })
            .set("Authorization", token);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            completed: false,
            course: "None",
            description: "test description",
            name: "test task",
            points: 200,
            time: 20,
        });
    });
});

// get all tasks for a user
describe("GET /users/:id/tasks", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/users/${id}/tasks`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.tasks.length).toBe(1);
        expect(response.body.tasks[0].name).toBe("test task");
        expect(response.body.tasks[0].description).toBe("test description");
        expect(response.body.tasks[0].time).toBe(20);
    });
});

// search for a song
describe("GET /searchSong", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get("/searchSong")
            .query({ songName: "test" })
            .set("Authorization", token);
        expect(response.status).toBe(200);
    });
});

// add a playlist
describe("POST /users/:id/playlist", () => {
    test("it responds with a 201 status code", async () => {
        const response = await supertest(app)
            .post(`/users/${id}/playlist`)
            .send({
                name: "test playlist",
                description: "test description",
                songs: [],
            })
            .set("Authorization", token);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("test playlist");
        expect(response.body.description).toBe("test description");
        expect(response.body.songs.length).toBe(0);
        expect(response.body.creator).toBe(id);
    });
});

// get all playlists for a user
describe("GET /users/:id/playlists", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/users/${id}/playlists`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("test playlist");
        expect(response.body[0].description).toBe("test description");
        expect(response.body[0].songs.length).toBe(0);
        expect(response.body[0].creator).toBe(id);
    });
});
