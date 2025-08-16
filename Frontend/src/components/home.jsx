import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
    const [characters, setCharacters] = useState([]);
    const [newCharacter, setNewCharacter] = useState({
        name: "",
        realName: "",
        universe: ""
    });
    const [editingCharacterId, setEditingCharacterId] = useState(null);
    const [editingCharacterData, setEditingCharacterData] = useState({
        name: "",
        realName: "",
        universe: ""
    });

    const fetchCharacters = () => {
        axios
            .get("http://localhost:3000/characters")
            .then((res) => setCharacters(res.data))
            .catch((err) => console.error("Erreur de chargement :", err));
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleAdd = () => {
        if (!newCharacter.name || !newCharacter.realName || !newCharacter.universe) {
            alert("Tous les champs sont requis !");
            return;
        }

        axios
            .post("http://localhost:3000/characters", newCharacter)
            .then(() => {
                fetchCharacters();
                setNewCharacter({ name: "", realName: "", universe: "" });
            })
            .catch((err) => console.error("Erreur d'ajout :", err));
    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:3000/characters/${id}`)
            .then(() => fetchCharacters())
            .catch((err) => console.error("Erreur de suppression :", err));
    };

    const startEditing = (char) => {
        setEditingCharacterId(char.id);
        setEditingCharacterData({
            name: char.name,
            realName: char.realName,
            universe: char.universe
        });
    };

    const cancelEditing = () => {
        setEditingCharacterId(null);
        setEditingCharacterData({ name: "", realName: "", universe: "" });
    };

    const saveEditing = (id) => {
        const { name, realName, universe } = editingCharacterData;
        if (!name || !realName || !universe) {
            alert("Tous les champs sont requis !");
            return;
        }

        axios
            .put(`http://localhost:3000/characters/${id}`, editingCharacterData)
            .then(() => {
                fetchCharacters();
                cancelEditing();
            })
            .catch((err) => console.error("Erreur de modification :", err));
    };

    return (
        <div className="flex w-full p-10 bg-gray-100 justify-center min-h-screen">
            <div className="bg-white rounded-2xl p-10 flex flex-col gap-6 w-[800px] shadow-md">
                <h1 className="text-2xl font-bold text-center">Liste des personnages</h1>

                {/* Formulaire d'ajout */}
                <div className="flex gap-4">
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        placeholder="Nom"
                        value={newCharacter.name}
                        onChange={(e) =>
                            setNewCharacter({ ...newCharacter, name: e.target.value })
                        }
                    />
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        placeholder="Nom réel"
                        value={newCharacter.realName}
                        onChange={(e) =>
                            setNewCharacter({ ...newCharacter, realName: e.target.value })
                        }
                    />
                    <input
                        className="border p-2 rounded-md w-full"
                        type="text"
                        placeholder="Univers"
                        value={newCharacter.universe}
                        onChange={(e) =>
                            setNewCharacter({ ...newCharacter, universe: e.target.value })
                        }
                    />
                    <button
                        className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
                        onClick={handleAdd}
                    >
                        Add+
                    </button>
                </div>

                <ul className="flex justify-between font-bold border-b pb-2">
                    <li className="w-[10%]">ID</li>
                    <li className="w-[20%]">Nom</li>
                    <li className="w-[30%]">Nom Réel</li>
                    <li className="w-[20%]">Univers</li>
                    <li className="w-[20%]">Actions</li>
                </ul>

                {characters.map((char) => (
                    <ul
                        key={char.id}
                        className="flex justify-between border-b py-2 items-center"
                    >
                        <li className="w-[10%]">{char.id}</li>

                        {editingCharacterId === char.id ? (
                            <>
                                <li className="w-[20%]">
                                    <input
                                        className="border p-1 rounded-md w-full"
                                        type="text"
                                        value={editingCharacterData.name}
                                        onChange={(e) =>
                                            setEditingCharacterData({
                                                ...editingCharacterData,
                                                name: e.target.value
                                            })
                                        }
                                    />
                                </li>
                                <li className="w-[30%]">
                                    <input
                                        className="border p-1 rounded-md w-full"
                                        type="text"
                                        value={editingCharacterData.realName}
                                        onChange={(e) =>
                                            setEditingCharacterData({
                                                ...editingCharacterData,
                                                realName: e.target.value
                                            })
                                        }
                                    />
                                </li>
                                <li className="w-[20%]">
                                    <input
                                        className="border p-1 rounded-md w-full"
                                        type="text"
                                        value={editingCharacterData.universe}
                                        onChange={(e) =>
                                            setEditingCharacterData({
                                                ...editingCharacterData,
                                                universe: e.target.value
                                            })
                                        }
                                    />
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="w-[20%]">{char.name}</li>
                                <li className="w-[30%]">{char.realName}</li>
                                <li className="w-[20%]">{char.universe}</li>
                            </>
                        )}

                        <li className="w-[20%] flex gap-2">
                            {editingCharacterId === char.id ? (
                                <>
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md"
                                        onClick={() => saveEditing(char.id)}
                                    >
                                        Sauvegarder
                                    </button>
                                    <button
                                        className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded-md"
                                        onClick={cancelEditing}
                                    >
                                        Annuler
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-md"
                                        onClick={() => startEditing(char)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                                        onClick={() => handleDelete(char.id)}
                                    >
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default Home;
