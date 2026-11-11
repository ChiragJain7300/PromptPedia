import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

const NEST_API = process.env.NEST_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const POST = async (request) => {
  const body = await request.json();
  const { userId, prompt, tag, creatorId, content, title } = body;

  if (NEST_API) {
    try {
      const res = await fetch(`${NEST_API}/prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: content || prompt,
          tag,
          creatorId: creatorId || userId,
        }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.warn("Falling back to local DB due to API proxy error:", err.message);
    }
  }

  try {
    await connectToDB();
    const newPrompt = new Prompt({
      creator: userId || creatorId,
      prompt: prompt || content,
      tag,
    });

    await newPrompt.save();
    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
