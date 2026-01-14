import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, callback_query } = body

    // Handle text messages
    if (message?.text) {
      return handleMessage(message)
    }

    // Handle button callbacks
    if (callback_query) {
      return handleCallback(callback_query)
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return Response.json({ ok: false }, { status: 500 })
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id
  const text = message.text
  const userId = message.from.id

  // /start command
  if (text === "/start") {
    const welcomeMsg = `
Welcome to EventFlow Bot! 🎉

Here's what I can do:
• /events - View upcoming events
• /register [event_id] - Register for an event
• /myregistrations - View your registrations
• /help - Show this help message
    `
    return sendTelegramMessage(chatId, welcomeMsg)
  }

  // /events command
  if (text === "/events") {
    try {
      const result = await db.events.getAll()
      const events = Array.isArray(result) ? result : []

      if (events.length === 0) {
        return sendTelegramMessage(chatId, "No events available at the moment.")
      }

      let eventsList = "📅 *Upcoming Events*\n\n"
      events.slice(0, 5).forEach((event: any, idx: number) => {
        eventsList += `${idx + 1}. *${event.title}*\n`
        eventsList += `   📍 ${event.location}\n`
        eventsList += `   📆 ${new Date(event.date).toLocaleDateString()}\n`
        eventsList += `   ⏰ ${event.start_time}\n\n`
      })

      return sendTelegramMessage(chatId, eventsList, {
        parse_mode: "Markdown",
      })
    } catch (error) {
      return sendTelegramMessage(chatId, "Failed to fetch events.")
    }
  }

  // /help command
  if (text === "/help") {
    const helpMsg = `
*EventFlow Bot Commands:*

/start - Welcome message
/events - List all upcoming events
/register - Register for an event
/myregistrations - View your registrations
/help - Show this help message
    `
    return sendTelegramMessage(chatId, helpMsg, { parse_mode: "Markdown" })
  }

  // Default response
  return sendTelegramMessage(chatId, "I didn't understand that. Type /help to see available commands.")
}

async function handleCallback(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id
  const data = callbackQuery.data

  if (data.startsWith("register_")) {
    const eventId = data.replace("register_", "")
    return sendTelegramMessage(
      chatId,
      `To complete your registration for this event, please visit our website and provide your details.`,
    )
  }

  return Response.json({ ok: true })
}

async function sendTelegramMessage(chatId: number, text: string, options: any = {}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN

  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN not set")
    return Response.json({ error: "Bot token not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...options,
      }),
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error("Failed to send Telegram message:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
