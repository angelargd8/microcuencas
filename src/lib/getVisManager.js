import fs from 'fs';
import path from 'path';

export function getVisManager() {
    const folderPath = path.join(process.cwd(), 'public/assets/vis');
    const files = fs.readdirSync(folderPath)
    const ndvi = []
    const mndwi = []
    const rgb = []
    files.forEach((im)=>{
        if (im.endsWith('_rgb.png')){
            rgb.push(im)
        }
        if (im.endsWith('_ndvi.png')){
            ndvi.push(im)
        }
        if (im.endsWith('_mndwi.png')){
            mndwi.push(im)
        }
    })
    
    const imageMap = {
        'rgb': rgb,
        'ndvi': ndvi,
        'mndwi': mndwi,
    }
    return imageMap
//   const map = {};

//   folders.forEach((folder) => {
//     const folderPath = path.join(basePath, folder);
//     const files = fs.readdirSync(folderPath).filter((file) =>
//       /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
//     );
//     map[folder] = files;
//   });

//   return map;
}
