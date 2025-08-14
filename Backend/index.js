const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/characters", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier");
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData.characters);
        } catch (parseErr) {
            console.error("Erreur de parsing JSON :", parseErr);
            res.status(500).send("Erreur de parsing du fichier JSON");
        }
    });
});

app.post("/characters", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const newCharacter = req.body;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier");
        }

        try {
            const jsonData = JSON.parse(data);

            newCharacter.id = jsonData.characters.length > 0
                ? jsonData.characters[jsonData.characters.length - 1].id + 1
                : 1;

            jsonData.characters.push(newCharacter);

            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    console.error("Erreur lors de l'écriture du fichier :", err);
                    return res.status(500).send("Erreur lors de l'écriture du fichier");
                }

                res.status(201).json(newCharacter);
            });

        } catch (parseErr) {
            console.error("Erreur de parsing JSON :", parseErr);
            res.status(500).send("Erreur de parsing du fichier JSON");
        }
    });
});

app.get("/characters/:id", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture :", err);
            return res.status(500).send("Erreur lors de la lecture du fichier");
        }

        try {
            const jsonData = JSON.parse(data);
            const characterId = parseInt(req.params.id);
            const character = jsonData.characters.find(c => c.id === characterId);

            if (!character) {
                return res.status(404).send("Personnage non trouvé");
            }

            res.json(character);
        } catch (parseErr) {
            console.error("Erreur de parsing JSON :", parseErr);
            res.status(500).send("Erreur de parsing du fichier JSON");
        }
    });
});

app.put("/characters/:id", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const id = parseInt(req.params.id);
    const { name, realName, universe } = req.body;

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lecture fichier :", err);
            return res.status(500).json({ message: "Erreur de lecture du fichier" });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Erreur parsing JSON :", parseErr);
            return res.status(500).json({ message: "Erreur de parsing JSON" });
        }

        const character = jsonData.characters.find(char => char.id === id);
        if (!character) {
            return res.status(404).json({ message: "Personnage non trouvé" });
        }

        if (name !== undefined) character.name = name;
        if (realName !== undefined) character.realName = realName;
        if (universe !== undefined) character.universe = universe;

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Erreur écriture fichier :", writeErr);
                return res.status(500).json({ message: "Erreur lors de l'écriture du fichier" });
            }

            res.status(200).json({
                message: "Personnage mis à jour avec succès",
                character: character
            });
        });
    });
});

app.delete("/characters/:id", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const id = parseInt(req.params.id);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lecture fichier :", err);
            return res.status(500).json({ message: "Erreur de lecture du fichier" });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error("Erreur parsing JSON :", parseErr);
            return res.status(500).json({ message: "Erreur de parsing JSON" });
        }

        const index = jsonData.characters.findIndex(char => char.id === id);
        if (index === -1) {
            return res.status(404).json({ message: "Personnage non trouvé" });
        }

        const deletedCharacter = jsonData.characters.splice(index, 1)[0];

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error("Erreur écriture fichier :", writeErr);
                return res.status(500).json({ message: "Erreur lors de l'écriture du fichier" });
            }

            res.status(200).json({
                message: "Personnage supprimé avec succès",
                character: deletedCharacter
            });
        });
    });
});





app.listen(port, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
