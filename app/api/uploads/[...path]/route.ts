// /app/api/uploads/[...path]/route.ts
import sharp from 'sharp'
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";
import mime from "mime";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '6mb',
        },
    },
};

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    const filePath = join(process.cwd(), "uploads", path.join('/'));

    const url = new URL(req.url);
    const width = parseInt(url.searchParams.get("w") || '0', 10);
    const quality = parseInt(url.searchParams.get("q") || '75', 10);


    const fileBuffer = await readFile(filePath);
    let image = sharp(fileBuffer);

    if(width > 0) image = image.resize(width);
    const ext = filePath.split('.').pop() || 'jpg'
    let optimizedBuffer;
    if(ext === 'png') {
        optimizedBuffer = await image.png({ compressionLevel: 6 }).toBuffer();
    } else if(ext === 'webp') {
        optimizedBuffer = await image.webp({ quality }).toBuffer();
    } else {
        optimizedBuffer = await image.jpeg({ quality }).toBuffer();
    }

    // ✅ Convert Buffer to Uint8Array (compatible with BodyInit)
    return new NextResponse(new Uint8Array(optimizedBuffer), {
        headers: {
            "Content-Type": mime.getType(`file.${ext}`) || 'application/octet-stream',
        }
    });
}