import { buildUserPayload, RegisterUserFormData, RegisterUserPhotoFormData } from "@/schemas/registerUserSchema";
import axios from "axios";

function base64ToBlob(dataUri: string): Blob {
  const [prefix, base64] = dataUri.split(',');
  const mimeMatch = prefix.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

export const postUsuario = async (
  userData: RegisterUserFormData,
  profilePhoto?: RegisterUserPhotoFormData
): Promise<any> => {
  const formData = new FormData();

  // Adiciona o JSON como Blob para backend desserializar
  const jsonBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
  formData.append('user_data', jsonBlob);

  if (profilePhoto) {

    console.log("= = = = = = = = = = = = = = ATENÇÃO cmc ARQUIVO = = = = = = = = = = = = =");
    console.log(profilePhoto);
    console.log("= = = = = = = = = = = = = = ATENÇÃO fim ARQUIVO = = = = = = = = = = = = =");
    
    // Detecta se uri é base64 (data URI)
    if (profilePhoto.uri.startsWith('data:')) {
      const blob = base64ToBlob(profilePhoto.uri);
      formData.append('profile_photo', blob, profilePhoto.name);
    } else { 
      // URI local normal, repassa direto
      formData.append('profile_photo', {
        uri: profilePhoto.uri,
        type: profilePhoto.type,
        name: profilePhoto.name,
      } as any);
    }
  }

  // Importante: NÃO definir manualmente 'Content-Type', deixe axios cuidar disso

  const response = await axios.post(
    'https://harppia-endpoints.onrender.com/v1/users/register',
    formData,
  );

  return response.data;
};