import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";

const NEST_API = process.env.NEST_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const GET = async (request, { params }) => {
  if (NEST_API) {
    try {
      const res = await fetch(`${NEST_API}/prompts/${params.id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.warn("Falling back to local DB:", err.message);
    }
  }

  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const body = await request.json();
  const { prompt, tag, content, title } = body;

  if (NEST_API) {
    try {
      const res = await fetch(`${NEST_API}/prompts/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: content || prompt,
          tag,
        }),
      });
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.warn("Falling back to local DB:", err.message);
    }
  }

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    existingPrompt.prompt = prompt || content;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response("Successfully updated the Prompts", { status: 200 });
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  if (NEST_API) {
    try {
      const res = await fetch(`${NEST_API}/prompts/${params.id}`, {
        method: "DELETE",
      });
      return new Response("Prompt deleted successfully", {
        status: res.status,
      });
    } catch (err) {
      console.warn("Falling back to local DB:", err.message);
    }
  }

  try {
    await connectToDB();

    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
