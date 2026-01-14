export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { chatId, message, eventId } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN

    if (!botToken) {
      return Response.json({ error: "Bot token not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (response.ok) {
      return Response.json({ success: true })
    } else {
      return Response.json({ error: "Failed to send notification" }, { status: 500 })
    }
  } catch (error) {
    console.error("Notification error:", error)
    return Response.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
