export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ticktopia_preset'); // El que creaste
  const res = await fetch(`https://api.cloudinary.com/v1_1/drpder52d/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Error al subir imagen a Cloudinary');
  }

  return data.secure_url; // Esta URL es la que debes guardar en tu backend
};
