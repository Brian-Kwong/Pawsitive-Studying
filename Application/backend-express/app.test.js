import supertest from "supertest";
import app from "./backend.js";
import { initDatabase, closeDatabase } from "./backend.js";
import e from "express";

beforeAll(() => {
    return initDatabase();
});
afterAll(() => {
    return closeDatabase();
});

let token = "Bearer ";
let id;
let playlistId;
let songId;

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
    // trying request without token
    test("it responds with a 401 status code", async () => {
        const response = await supertest(app).get("/user");
        expect(response.status).toBe(401);
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
describe("GET search for a a song", () => {
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
        expect(response.body.numberOfSongs).toBe(0);
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
        playlistId = response.body[0]._id;
        expect(response.body[0].name).toBe("test playlist");
        expect(response.body[0].description).toBe("test description");
        expect(response.body[0].songs.length).toBe(0);
        expect(response.body[0].creator).toBe(id);
    });
});

// add a song to a playlist for a user
// first find it on soundcloud then add to playlist
// /users/:id/:playlistId/song
describe("ADD song to playlist for user", () => {
    test("it responds with a 201 status code", async () => {
        const response = await supertest(app)
            .post(`/users/${id}/${playlistId}/song`)
            .send({
                songName: "Sub Urban - Cradles [NCS Release]",
                length: 209,
                artist: "Sub Urban",
                artistCoverURL:
                    "https://i1.sndcdn.com/artworks-000634506352-b3zsid-large.jpg",
                songURL:
                    "https://api-v2.soundcloud.com/media/soundcloud:tracks:554484609/631eaf2f-cb7f-4e57-84ba-59c645b31302/stream/hls",
                soundCloudURL:
                    "https://soundcloud.com/nocopyrightsounds/sub-urban-cradles-ncs-release",
            })
            .set("Authorization", token);
        expect(response.status).toBe(201);
        expect(response.body.songs.length).toBe(1);
        expect(response.body.numberOfSongs).toBe(1);
        expect(response.body.songs[0].songName).toBe(
            "Sub Urban - Cradles [NCS Release]"
        );
        expect(response.body.songs[0].length).toBe(209);
        expect(response.body.songs[0].artist).toBe("Sub Urban");
        expect(response.body.songs[0].artistCoverURL).toBe(
            "https://i1.sndcdn.com/artworks-000634506352-b3zsid-large.jpg"
        );
        expect(response.body.songs[0].songURL).toBe(
            "https://api-v2.soundcloud.com/media/soundcloud:tracks:554484609/631eaf2f-cb7f-4e57-84ba-59c645b31302/stream/hls"
        );
        songId = response.body.songs[0]._id;
    });
});

// get stream URL
describe("GET stream URL", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/songs/stream/${songId}`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
    });
});

// get name of user
describe("GET name by id", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/users/${id}/name`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("test");
    });
});

// set name of user
describe("PUT name by id", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .put(`/users/${id}/name`)
            .send({ name: "kitty" })
            .set("Authorization", token);
        expect(response.status).toBe(201);
    });
});

// get email
describe("GET email", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/users/${id}/email`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
        expect(response.body.email).toBe("test@gmail.com");
    });
});

// set a new email
describe("PUT new email", () => {
    test("it responds with a 201 status code", async () => {
        const response = await supertest(app)
            .put(`/users/${id}/email`)
            .send({ email: "hello_world@gmail.com" })
            .set("Authorization", token);
        expect(response.status).toBe(201);
    });
});

// get profile image
describe("get PFP", () => {
    test("it responds with a 200 status code", async () => {
        const response = await supertest(app)
            .get(`/users/${id}/profileImage`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
    });
});
