const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const restify = require('restify');

// Configuração do servidor Restify
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`Servidor online em http://localhost:${process.env.port || process.env.PORT || 3978}`);
});

// Configuração do Bot Framework
const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Armazenamento em memória para a conversa
const storage = new MemoryStorage();
const conversationState = new ConversationState(storage);

// Middleware para mensagens proativas
server.use(restify.plugins.bodyParser());
server.post('/api/messages', async (req, res) => {
    await adapter.processActivity(req, res, async (context) => {
        // Verifique se a atividade é uma mensagem proativa
        if (context.activity.type === 'message') {
            // Lógica para lidar com mensagens de usuário
            await processUserMessage(context);
        } else if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded) {
            // Lógica para lidar com membros adicionados à conversa (por exemplo, bot sendo adicionado)
            await sendProactiveMessage(context);
        }
    });
});

// Função para enviar uma mensagem proativa
const sendProactiveMessage = async (context) => {
    // Construa a mensagem proativa
    const message = {
        type: 'message',
        text: 'Esta é uma mensagem proativa enviada pelo bot!'
    };

    // Envie a mensagem proativa
    await context.sendActivity(message);
};

// Função para lidar com mensagens de usuário
const processUserMessage = async (context) => {
    // Lógica para processar mensagens de usuário aqui
    // Por exemplo, responder às mensagens do usuário
    if (context.activity.text.toLowerCase() === 'você é um bot?') {
        // Responda afirmativamente
         await context.sendActivity('Sim, sou um bot! 😄');
    } else {
        // Responda com uma saudação padrão
        await context.sendActivity('Não tenho certeza de como responder a isso.');
    }
};
