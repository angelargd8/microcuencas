import fs from 'fs';
import path from 'path';

export function getImagesMap() {
  const basePath = path.join(process.cwd(), 'public/assets/img');
  const folders = fs.readdirSync(basePath).filter((folder) =>
    fs.statSync(path.join(basePath, folder)).isDirectory()
  );

  const map = {};

  folders.forEach((folder) => {
    const folderPath = path.join(basePath, folder);
    const files = fs.readdirSync(folderPath).filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    map[folder] = files;
  });

  return map;
}
