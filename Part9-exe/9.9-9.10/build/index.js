"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const diagnoses_1 = __importDefault(require("./data/diagnoses"));
const patients_1 = __importDefault(require("./data/patients"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3001;
// 9.8: Ping endpoint
app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
// 9.10: Get all diagnoses
app.get('/api/diagnoses', (_req, res) => {
    const diagnoses = diagnoses_1.default;
    res.json(diagnoses);
});
// 9.11: Get all patients (excluding ssn)
app.get('/api/patients', (_req, res) => {
    const patients = patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender: gender,
        occupation
    }));
    res.json(patients);
});
// 9.12: POST endpoint for adding new patients
app.post('/api/patients', (req, res) => {
    try {
        // 9.13: Validate and parse the request body
        const newPatientEntry = (0, utils_1.toNewPatientEntry)(req.body);
        // 9.12: Create new patient with unique ID
        const newPatient = Object.assign(Object.assign({ id: (0, uuid_1.v1)() }, newPatientEntry), { entries: [] });
        // Add to in-memory data store
        patients_1.default.push(newPatient);
        // Return the patient without SSN (for frontend)
        const { id, name, dateOfBirth, gender, occupation } = newPatient;
        const responsePatient = {
            id,
            name,
            dateOfBirth,
            gender,
            occupation
        };
        res.json(responsePatient);
    }
    catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send({ error: errorMessage });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
