import { getImagesMap } from '@/lib/getImageList';
import GaleriaClient from './GaleriaClient';

export default async function GaleriaPage() {
  const imageMap = getImagesMap();
  return <GaleriaClient imageMap={imageMap} />;
}
