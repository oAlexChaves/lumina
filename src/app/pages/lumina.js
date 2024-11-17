"use client"; // Adicione esta linha no topo

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const Lumina = () => {
  // Estado para armazenar as mensagens
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); // Para controlar o input
  const [pdfJson, setPdfJson] = useState(null); // Estado para armazenar o JSON do PDF

  // Função para enviar a mensagem
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage(""); // Limpa o input após enviar
    }
  };

  // Função para processar o arquivo PDF
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const pdfData = new Uint8Array(reader.result);
        // Lê o PDF com o pdf.js
        pdfjsLib.getDocument(pdfData).promise.then((pdf) => {
          let pdfTextContent = "";
          const numPages = pdf.numPages;
          let pagePromises = [];

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            pagePromises.push(
              pdf.getPage(pageNum).then((page) => {
                return page.getTextContent().then((textContent) => {
                  pdfTextContent += textContent.items.map(item => item.str).join(" ") + "\n";
                });
              })
            );
          }

          Promise.all(pagePromises).then(() => {
            // Cria o objeto JSON
            const pdfDataJson = {
              filename: file.name,
              numPages: numPages,
              textContent: pdfTextContent,
            };

            setPdfJson(pdfDataJson); // Armazena o JSON no estado
            // Exibe o JSON no console
            console.log("PDF em formato JSON:", JSON.stringify(pdfDataJson, null, 2));
            // Adiciona uma mensagem indicando que o PDF foi processado
            setMessages([...messages, { text: "Arquivo PDF processado.", sender: "system" }]);
          });
        }).catch((error) => {
          console.error("Erro ao ler o PDF: ", error);
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Por favor, carregue um arquivo PDF.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>Lumina</div>

      {/* Exibe as mensagens no chat */}
      <div style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.sender === "user" ? styles.userMessage : styles.receivedMessage),
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Container do input e botão */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          style={styles.input}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Insira sua mensagem"
        />
        <button style={styles.button} onClick={handleSendMessage}>
          ➤
        </button>
      </div>

      {/* Input para carregar arquivos PDF */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        style={styles.fileInput}
      />
    </div>
  );
};

// Estilos em formato de objeto JS
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100vh",
    backgroundColor: "#1e1e1e",
    fontFamily: '"Arial", sans-serif',
    padding: "20px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxHeight: "70vh",
    overflowY: "scroll",
    marginBottom: "20px",
  },
  message: {
    maxWidth: "70%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "16px",
    lineHeight: "1.4",
    wordWrap: "break-word",
  },
  userMessage: {
    backgroundColor: "#4CAF50", // Cor para a mensagem do usuário
    alignSelf: "flex-end",
    color: "#fff",
  },
  receivedMessage: {
    backgroundColor: "#333", // Cor para a mensagem recebida
    alignSelf: "flex-start",
    color: "#fff",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #333",
    borderRadius: "20px",
    backgroundColor: "#2c2c2c",
    padding: "10px 15px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: "16px",
    marginRight: "10px",
  },
  button: {
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  fileInput: {
    marginTop: "20px",
    padding: "10px",
    color: "#fff",
    backgroundColor: "#333",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

// Adiciona o efeito hover diretamente no botão
styles.button[":hover"] = {
  backgroundColor: "#555",
};

export default Lumina;
