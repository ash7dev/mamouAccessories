import { NextResponse } from 'next/server';
import { getUnsignedUploadConfig } from '@/lib/cloudinary';

// GET /api/cloudinary/config - Récupérer la configuration pour l'upload direct
export async function GET() {
  try {
    const config = getUnsignedUploadConfig();

    return NextResponse.json({
      cloudName: config.cloudName,
      uploadPreset: config.uploadPreset,
      folder: config.folder,
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting Cloudinary config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la configuration' },
      { status: 500 }
    );
  }
}
