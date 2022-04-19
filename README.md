# Kelle Estella (Telegram)


[![GitHub issues](https://img.shields.io/github/issues/luisgbr1el/kelle-telegram?style=flat-square)](https://github.com/luisgbr1el/kelle-telegram/issues)
[![GitHub forks](https://img.shields.io/github/forks/luisgbr1el/kelle-telegram?style=flat-square)](https://github.com/luisgbr1el/kelle-telegram/network)
[![GitHub stars](https://img.shields.io/github/stars/luisgbr1el/kelle-telegram?style=flat-square)](https://github.com/luisgbr1el/kelle-telegram/stargazers)
[![GitHub license](https://img.shields.io/github/license/luisgbr1el/kelle-telegram?style=flat-square)](https://github.com/luisgbr1el/kelle-telegram/blob/main/LICENSE)

Um simples bot para o **Telegram** que baixa vídeos e áudios do TikTok, clipes da Twitch & outras funcionalidades.

[Clique aqui](https://t.me/KelleEstellaBot) para utilizá-lo.

<img src="https://cdn.worldvectorlogo.com/logos/telegram-1.svg" width="50px">

# Compilar
Para compilar o bot em seu PC, comece **baixando** ou **clonando** [esse repositório](https://github.com/luisgbr1el/kelle-telegram).
### 1. Clonando repositório
Para clonar esse repositório utilizando o **Git**, digite em seu console:
```
git clone https://github.com/luisgbr1el/kelle-telegram.git
```

### 2. Instalando packages
Para fazer o bot funcionar, você precisa instalar todas as **packages** que foram utilizadas no projeto. Para fazer isso, entre na pasta do projeto pelo **console** e digite:
```
npm install
```
Isso instalará todos os pacotes necessários.

### 3. Inserindo seu token
Para que o bot seja iniciado, você precisa inserir seu *token* no código.

**Obs:** Você consegue um criando um bot com o [BotFather](https://t.me/BotFather), no próprio Telegram.

Depois de copiar seu *token*, vá até essa linha do código em `index.js`:
```
const token = process.env['token'];
```
E substitua `process.env['token']` pelo seu *token*, entre aspas. Afinal, é uma *String*.

### 4. Rodar o bot
Finalmente, vá até o **console** e digite:
```
node index.js
```

# Contribua
Você pode contribuir com o repositório solicitando um **Pull Request**.

# Autores
- [luisgbr1el](https://github.com/luisgbr1el)
- [juniodevs](https://github.com/juniodevs)
