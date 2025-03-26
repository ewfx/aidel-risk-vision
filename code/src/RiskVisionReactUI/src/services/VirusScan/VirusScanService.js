export const scanFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    body: formData,
    headers: {
      'x-apikey': 'YOUR_VIRUSTOTAL_API_KEY_HERE'
    }
  });

  if (!response.ok) {
    return { error: 'Failed to scan file.' };
  }

  return response.json();
};