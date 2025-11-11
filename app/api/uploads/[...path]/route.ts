// /app/api/uploads/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import mime from "mime";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    const relativePath = path.join("/"); // e.g. "product-images/abc.jpg"
    const filePath = join(process.cwd(), "uploads", relativePath);

    try {
        const fileBuffer = await readFile(filePath);
        const contentType = mime.getType(filePath) || "application/octet-stream";

        // ✅ Convert Buffer to Uint8Array (compatible with BodyInit)
        return new NextResponse(new Uint8Array(fileBuffer), {
            headers: { "Content-Type": contentType },
        });
    } catch (err) {
        console.warn("File not found:", filePath, err);
        return new NextResponse("File not found", { status: 404 });
    }
}