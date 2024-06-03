import { Character, User } from "./schema.js";

// Gets a character either for a user or all characters in the dataset
export async function getCharacters(req, res) {
    const userID = req.params.id;
    try {
        if (userID) {
            const charactersID =
                await User.findById(userID).select("characters");
            if (!charactersID) {
                return res.status(404).send("User not found");
            }
            res.status(200).send(charactersID);
        } else {
            const characters = await Character.find();
            res.status(200).send(characters);
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

// Adds a character to a user
// Removes n number of points from the user (Need to update this after changing the schema)
export async function addCharToUser(req, res) {
    const userID = req.params.id;
    const { characterID } = req.body;
    try {
        let user = await User.findById(userID);
        const character = await Character.findById(characterID);
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            if (user.points >= character.pointsRequired) {
                user.characters.push(characterID);
                user.points -= character.pointsRequired;
                user.save();
                res.status(201).send(user);
            } else {
                res.status(400).send("Not enough points");
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }
}
