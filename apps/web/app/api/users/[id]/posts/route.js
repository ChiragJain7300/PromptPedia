import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";

const NEST_API = process.env.NEST_API_URL || process.env.NEXT_PUBLIC_API_URL;

export const GET = async (request, { params }) => {
  if (NEST_API) {
    try {
      const res = await fetch(`${NEST_API}/prompts/user/${params.id}`, {
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

    const prompts = await Prompt.find({ creator: params.id }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
