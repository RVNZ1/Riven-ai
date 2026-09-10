let currentMode = "general";

let conversation = [];

const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");


function setMode(mode, element) {

    currentMode = mode;

    document.querySelectorAll(".mode").forEach(btn => {
        btn.classList.remove("active");
    });

    element.classList.add("active");

    const titles = {
        general: "Riven AI",
        coding: "Riven Coding",
        math: "Riven Mathematics",
        science: "Riven Science"
    };

    document.getElementById("modeTitle").textContent = titles[mode];
}


function useSuggestion(text) {

    input.value = text;

    input.focus();

    sendMessage();
}


function handleEnter(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();
    }
}


function addMessage(role, text) {

    const message = document.createElement("div");

    message.className = `message ${role}`;

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent = role === "user" ? "K" : "R";

    const content = document.createElement("div");

    content.className = "message-content";

    content.textContent = text;

    message.appendChild(avatar);

    message.appendChild(content);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    return content;
}


function showLoading() {

    return addMessage("ai", "Riven sedang berpikir...");
}


async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    addMessage("user", message);

    conversation.push({
        role: "user",
        content: message
    });

    input.value = "";

    sendButton.disabled = true;

    const loading = showLoading();

    try {

        const response = await fetch(
            "https://YOUR-BACKEND-URL.com/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: message,

                    mode: currentMode,

                    history: conversation

                })

            }
        );


        if (!response.ok) {
            throw new Error("Server error");
        }


        const data = await response.json();

        loading.textContent = data.reply;

        conversation.push({
            role: "assistant",
            content: data.reply
        });


    } catch (error) {

        loading.textContent =
            "Maaf, Riven belum bisa terhubung ke server. Coba cek backend kamu.";

        console.error(error);

    } finally {

        sendButton.disabled = false;

    }
}


function newChat() {

    conversation = [];

    chat.innerHTML = `
        <div class="welcome">

            <div class="big-logo">
                R
            </div>

            <h1>Halo, aku Riven 👋</h1>

            <p>
                Aku bisa membantu kamu belajar, mengerjakan soal,
                memahami materi, dan terutama membantu coding.
            </p>

            <div class="suggestions">

                <button onclick="useSuggestion('Jelaskan integral dengan cara yang mudah dipahami')">
                    🧮 Belajar Matematika
                </button>

                <button onclick="useSuggestion('Bantu aku belajar HTML dan CSS dari dasar')">
                    💻 Belajar Coding
                </button>

                <button onclick="useSuggestion('Jelaskan hukum Newton dengan contoh sederhana')">
                    🔬 Belajar Fisika
                </button>

                <button onclick="useSuggestion('Buatkan rangkuman materi sejarah untuk SMA')">
                    📚 Rangkuman Pelajaran
                </button>

            </div>

        </div>
    `;
}


function toggleSidebar() {

    document
        .querySelector(".sidebar")
        .classList.toggle("show");

      }
