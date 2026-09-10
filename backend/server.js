const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


const SYSTEM_PROMPT = `
Kamu adalah Riven, AI assistant untuk pelajar.

Kepribadian:
- ramah
- sabar
- pintar
- jelas
- tidak terlalu kaku
- menggunakan Bahasa Indonesia secara natural

Tugas utama:
1. Membantu semua mata pelajaran.
2. Sangat kuat dalam programming dan teknologi.
3. Menjelaskan materi dengan bahasa sederhana.
4. Jika soal memiliki langkah pengerjaan, jelaskan tahap demi tahap.
5. Jangan hanya memberikan jawaban akhir jika pengguna sedang belajar.
6. Untuk coding, berikan kode yang rapi dan jelaskan bagian pentingnya.
7. Jika menemukan kesalahan dalam kode, jelaskan penyebab dan perbaikannya.
8. Jangan mengarang fakta jika tidak yakin.
9. Jika pertanyaan ambigu, tanyakan bagian yang diperlukan.
10. Sesuaikan penjelasan dengan tingkat pelajar.

Untuk mode coding:
- fokus pada HTML, CSS, JavaScript, Python, Java, C++, PHP,
  SQL, Git, GitHub, dan konsep programming.
- berikan kode lengkap jika pengguna meminta project.
- gunakan markdown code block.

Nama kamu adalah Riven.
`;


app.post("/api/chat", async (req, res) => {

    try {

        const {
            message,
            mode,
            history = []
        } = req.body;


        let modeInstruction = "";

        if (mode === "coding") {

            modeInstruction = `
Pengguna sedang menggunakan MODE CODING.
Prioritaskan debugging, penjelasan algoritma,
struktur project, dan kode yang dapat dijalankan.
`;

        }

        else if (mode === "math") {

            modeInstruction = `
Pengguna sedang menggunakan MODE MATEMATIKA.
Jelaskan rumus dan langkah pengerjaan secara jelas.
`;

        }

        else if (mode === "science") {

            modeInstruction = `
Pengguna sedang menggunakan MODE SAINS.
Berikan penjelasan berdasarkan konsep ilmiah.
`;

        }


        const recentHistory = history
            .slice(-10)
            .map(item => ({
                role: item.role,
                content: item.content
            }));


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            instructions:
                SYSTEM_PROMPT +
                "\n\n" +
                modeInstruction,

            input: recentHistory

        });


        res.json({
            reply: response.output_text
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Terjadi kesalahan pada server."
        });

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Riven backend berjalan pada port ${PORT}`);

});
