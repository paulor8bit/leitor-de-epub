
# Leitor de Livros em Chat (EPUB & TXT)
Site: https://leitor-de-epub-em-chat-1098215553643.us-west1.run.app/

Este é um leitor de livros digital acessível pelo navegador, que transforma arquivos `.epub` e `.txt` em uma experiência de leitura interativa, semelhante a um chat. O aplicativo exibe o conteúdo parágrafo por parágrafo, oferecendo funcionalidades avançadas como narração por voz, controle de velocidade e navegação rápida.

## ✨ Funcionalidades

- **Upload Simples**: Suporta upload de arquivos `.epub` e `.txt` através de um seletor de arquivos ou arrastando e soltando (drag-and-drop).
- **Interface de Chat**: Apresenta o texto de forma limpa e moderna, com um parágrafo por vez, facilitando o foco na leitura.
- **Indicador de Progresso**: Mostra a posição atual no livro (`parágrafo atual / total`) e a porcentagem de leitura concluída.
- **Navegação Rápida**: Permite saltar diretamente para qualquer parágrafo do livro usando a função "Ir para".
- **Narração por Voz (Text-to-Speech)**:
  - Lê os parágrafos em voz alta usando a API de Síntese de Voz do navegador.
  - Tenta selecionar automaticamente uma voz feminina em Português do Brasil para uma experiência mais natural.
- **Narração Automática com Controle de Velocidade**:
  - Avança para o próximo parágrafo automaticamente após a conclusão da leitura do atual.
  - Oferece controle de velocidade cíclico (`1.0x`, `1.2x`, `1.5x`, `2.0x`).
- **Design Responsivo**: Interface adaptada para funcionar bem em desktops, tablets e dispositivos móveis.
- **Sem Build**: Projeto configurado para rodar diretamente no navegador sem a necessidade de um processo de compilação (transpilação), usando ES Modules e CDNs.

## 🚀 Como Executar Localmente

Este projeto não precisa de um processo de `build` (como `npm run build`), pois utiliza CDNs para suas dependências. Você só precisa de um servidor web local para servir os arquivos estáticos.

### Pré-requisitos

- Um navegador web moderno (Chrome, Firefox, Edge).
- [Node.js](https://nodejs.org/) (opcional, para usar `npx serve`) ou [Python](https://www.python.org/) (geralmente já vem instalado em macOS e Linux).

### Instruções

1.  **Clone o repositório:**


2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```

3.  **Inicie um servidor web local.** Escolha uma das opções abaixo:

    **Opção A: Usando `npx serve` (Requer Node.js)**
    Este é o método mais simples se você tem Node.js instalado.
    ```bash
    npx serve .
    ```
    O servidor iniciará, e o terminal mostrará o endereço local (geralmente `http://localhost:3000`).

    **Opção B: Usando Python**
    Se você tem Python instalado, pode usar seu módulo de servidor HTTP embutido.

    *   Para Python 3:
        ```bash
        python -m http.server
        ```
    *   Para Python 2:
        ```bash
        python -m SimpleHTTPServer
        ```
    O servidor iniciará, geralmente em `http://localhost:8000`.

4.  **Abra o aplicativo no navegador:**
    Abra seu navegador e acesse o endereço fornecido pelo seu servidor local (ex: `http://localhost:3000` ou `http://localhost:8000`).

## 🛠️ Tecnologias Utilizadas

- **React 19**: Biblioteca para a construção da interface do usuário (carregada via CDN `esm.sh`).
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Tailwind CSS**: Framework de CSS para estilização rápida (carregado via CDN).
- **Epub.js**: Biblioteca para parsear e renderizar arquivos `.epub` (carregada via CDN).
- **Web Speech API**: API nativa do navegador para a funcionalidade de síntese de voz (Text-to-Speech).

## 📁 Estrutura de Arquivos

```
.
├── README.md               # Este arquivo de documentação.
├── index.html              # Ponto de entrada HTML, carrega scripts e estilos.
├── index.tsx               # Ponto de entrada do React, monta o componente App.
├── App.tsx                 # Componente principal que contém toda a lógica da aplicação.
├── metadata.json           # Metadados do aplicativo.
├── types.ts                # Definições de tipos TypeScript.
└── components/
    ├── ChatView.tsx        # Componente da interface de leitura (chat).
    ├── FileUpload.tsx      # Componente da interface de upload de arquivos.
    └── icons/              # Componentes de ícones SVG.
        ├── AutoPlayIcon.tsx
        ├── BookOpenIcon.tsx
        ├── LoadingSpinner.tsx
        ├── SpeakerOffIcon.tsx
        └── SpeakerOnIcon.tsx
```
