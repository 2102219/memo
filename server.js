import { serve } from "https://deno.land/std/http/server.ts";
import { extname } from "https://deno.land/std/path/mod.ts";

const fileDirectory = "./memo"; 

serve(async (req) => {
  const url = new URL(req.url);
  let path = url.pathname;

  if (path === "/memo") {
    path = "/index.html"; // ルートをindex.htmlにリダイレクト
  }

  const filePath = `${fileDirectory}${path}`;

  try {
    const content = await Deno.readFile(filePath);
    const fileExtension = extname(filePath).toLowerCase();

    let contentType = "text/plain";
    if (fileExtension === ".html") {
      contentType = "text/html";
    } else if (fileExtension === ".css") {
      contentType = "text/css";
    } else if (fileExtension === ".js") {
      contentType = "application/javascript";
    }

    return new Response(content, { headers: { "content-type": contentType } });
  } catch {
    return new Response("404: Not Found", { status: 404 });
  }
});

console.log("Server is running on http://localhost:8000");
