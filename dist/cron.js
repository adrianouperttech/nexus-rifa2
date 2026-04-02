"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("./utils/prisma"));
// Roda todo dia ao meio-dia
node_cron_1.default.schedule('0 12 * * *', async () => {
    console.log('[CRON] Iniciando verificação diária de pagamentos pendentes...');
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const pendingPayments = await prisma_1.default.reservationPayment.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lte: yesterday
                }
            },
            include: {
                buyer: true,
                raffle: {
                    include: { user: true }
                }
            }
        });
        for (const payment of pendingPayments) {
            if (!payment.raffle.user.whatsappToken)
                continue;
            console.log(`[CRON] Enviando WhatsApp de lembrete para ${payment.buyer.whatsapp}`);
            console.log(`[CRON] Rifa: ${payment.raffle.name} | Valor: R$${payment.amount}`);
            // Simulação da chamada de API Evolution ou Twilio
            /*
            await axios.post('https://evolution.api/message/sendText', {
              number: payment.buyer.whatsapp,
              options: { delay: 1200 },
              textMessage: {
                text: `Olá ${payment.buyer.name}, você reservou números na rifa ${payment.raffle.name} mas ainda não pagou. Pague usando nosso PIX Copia e Cola: ${payment.pixCopyPaste}`
              }
            }, {
              headers: { apikey: payment.raffle.user.whatsappToken }
            });
            */
        }
        console.log(`[CRON] Finalizado. Encontrou ${pendingPayments.length} pendentes.`);
    }
    catch (error) {
        console.error('[CRON] Erro ao verificar pagamentos pendentes:', error);
    }
});
