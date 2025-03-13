import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const handler = async (request) => {
  const filePath = path.join(__dirname, 'index.html');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return new Response(fileContent, {
    headers: { 'Content-Type': 'text/html' },
  });
};

export default handler;
