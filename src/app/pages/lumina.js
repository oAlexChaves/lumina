"use client"; // Adicione esta linha no topo

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const Lumina = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(""); // Para controlar o input
  const [pdfJson, setPdfJson] = useState(null); // Estado para armazenar o JSON do PDF

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
      setMessage(""); // Limpa o input após enviar
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const pdfData = new Uint8Array(reader.result);
        console.log("Arquivo PDF carregado com sucesso.");
        console.log("Nome do arquivo:", file.name); // Log para verificar o nome do arquivo

        // Lê o PDF com o pdf.js
        pdfjsLib.getDocument(pdfData).promise
          .then((pdf) => {
            console.log("PDF carregado com sucesso.");
            const numPages = pdf.numPages;
            console.log(`Número de páginas do PDF: ${numPages}`); // Log para verificar número de páginas
            
            let pdfTextContent = "";
            let pagePromises = [];
            
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
              pagePromises.push(
                pdf.getPage(pageNum).then((page) => {
                  console.log(`Processando a página ${pageNum}...`); // Log para indicar a página sendo processada
                  return page.getTextContent().then((textContent) => {
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    // Verificando se o texto foi extraído corretamente
                    if (pageText) {
                      console.log(`Texto extraído da página ${pageNum}:`, pageText);
                      pdfTextContent += pageText + "\n"; // Adiciona o texto da página ao conteúdo total
                    } else {
                      console.log(`Nenhum texto extraído na página ${pageNum}.`);
                    }
                  }).catch(err => {
                    console.error(`Erro ao obter o conteúdo da página ${pageNum}:`, err);
                  });
                }).catch(err => {
                  console.error(`Erro ao acessar a página ${pageNum}:`, err);
                })
              );
            }

            Promise.all(pagePromises).then(() => {
              const pdfDataJson = {
                filename: file.name,
                numPages: numPages,
                textContent: pdfTextContent,
              };

              setPdfJson(pdfDataJson); // Armazena o JSON no estado

              // Exibe as informações do arquivo no console
              console.log("Informações do PDF:");
              console.log("Nome do arquivo:", pdfDataJson.filename);
              console.log("Número de páginas:", pdfDataJson.numPages);
              console.log("Conteúdo extraído do PDF:", pdfTextContent); // Exibe o texto extraído

              // Exibe o JSON completo do PDF
              console.log("PDF em formato JSON:", JSON.stringify(pdfDataJson, null, 2));

              // Adiciona uma mensagem indicando que o PDF foi processado, agora como uma mensagem recebida
              setMessages([...messages, { text: `Arquivo PDF "${file.name}" foi lido com sucesso!`, sender: "received" }]);
            });
          })
          .catch((error) => {
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

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        style={styles.fileInput}
      />
    </div>
  );
};

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
    backgroundColor: "#4CAF50",
    alignSelf: "flex-end",
    color: "#fff",
  },
  receivedMessage: {
    backgroundColor: "#333",
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

export default Lumina;
