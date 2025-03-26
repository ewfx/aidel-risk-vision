export const scanFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://www.virustotal.com/api/v3/files', {
    method: 'POST',
    body: formData,
    headers: {
      'x-apikey': 'cbfd5a4712c711b9d413eaed94ef41bdf28c74c5cff8e8852e05e4efe06aa10d'
    }
  });

  if (!response.ok) {
    return { error: 'Failed to scan file.' };
  }

  return response.json();
};