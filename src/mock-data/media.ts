import type { Media } from './types';

// Real event photos — from business_data/events/*/*.jpg.
import hoiThao1 from '../assets/events/hoi-thao-truyen-thong/1.jpg';
import hoiThao2 from '../assets/events/hoi-thao-truyen-thong/2.jpg';
import hoiThao3 from '../assets/events/hoi-thao-truyen-thong/3.jpg';
import hoiThao4 from '../assets/events/hoi-thao-truyen-thong/4.jpg';
import hoiThao5 from '../assets/events/hoi-thao-truyen-thong/5.jpg';
import hoiThao6 from '../assets/events/hoi-thao-truyen-thong/6.jpg';
import hoiThao7 from '../assets/events/hoi-thao-truyen-thong/7.jpg';
import hoiThao8 from '../assets/events/hoi-thao-truyen-thong/8.jpg';

import laoDong1 from '../assets/events/lao-dong-hk3/1.jpg';
import laoDong2 from '../assets/events/lao-dong-hk3/2.jpg';
import laoDong3 from '../assets/events/lao-dong-hk3/3.jpg';
import laoDong4 from '../assets/events/lao-dong-hk3/4.jpg';
import laoDong5 from '../assets/events/lao-dong-hk3/5.jpg';

import gopNang1 from '../assets/events/gop-nang-cho-em/1.jpg';
import gopNang2 from '../assets/events/gop-nang-cho-em/2.jpg';
import gopNang3 from '../assets/events/gop-nang-cho-em/3.jpg';
import gopNang4 from '../assets/events/gop-nang-cho-em/4.jpg';
import gopNang5 from '../assets/events/gop-nang-cho-em/5.jpg';
import gopNang6 from '../assets/events/gop-nang-cho-em/6.jpg';
import gopNang7 from '../assets/events/gop-nang-cho-em/7.jpg';

// Media (Tài liệu): the generic attachment entity from the spec — currently only
// used by Activity (real photos, gradient placeholder photos, and invented BCH-only
// document names), but modeled so a Post/Comment could reference the same Media ids.
//
// Real photos (kind: 'image', has a url) are distinguishable from the gradient
// placeholder tiles (kind: 'image', no url — ActivityImage renders a CSS gradient
// keyed by id) and from documents (kind: 'document', has filename/size instead of url).
export const mediaLibrary: Record<string, Media> = {
  'img-hoi-thao-1': { id: 'img-hoi-thao-1', kind: 'image', url: hoiThao1 },
  'img-hoi-thao-2': { id: 'img-hoi-thao-2', kind: 'image', url: hoiThao2 },
  'img-hoi-thao-3': { id: 'img-hoi-thao-3', kind: 'image', url: hoiThao3 },
  'img-hoi-thao-4': { id: 'img-hoi-thao-4', kind: 'image', url: hoiThao4 },
  'img-hoi-thao-5': { id: 'img-hoi-thao-5', kind: 'image', url: hoiThao5 },
  'img-hoi-thao-6': { id: 'img-hoi-thao-6', kind: 'image', url: hoiThao6 },
  'img-hoi-thao-7': { id: 'img-hoi-thao-7', kind: 'image', url: hoiThao7 },
  'img-hoi-thao-8': { id: 'img-hoi-thao-8', kind: 'image', url: hoiThao8 },

  'img-lao-dong-1': { id: 'img-lao-dong-1', kind: 'image', url: laoDong1 },
  'img-lao-dong-2': { id: 'img-lao-dong-2', kind: 'image', url: laoDong2 },
  'img-lao-dong-3': { id: 'img-lao-dong-3', kind: 'image', url: laoDong3 },
  'img-lao-dong-4': { id: 'img-lao-dong-4', kind: 'image', url: laoDong4 },
  'img-lao-dong-5': { id: 'img-lao-dong-5', kind: 'image', url: laoDong5 },

  'img-gop-nang-1': { id: 'img-gop-nang-1', kind: 'image', url: gopNang1 },
  'img-gop-nang-2': { id: 'img-gop-nang-2', kind: 'image', url: gopNang2 },
  'img-gop-nang-3': { id: 'img-gop-nang-3', kind: 'image', url: gopNang3 },
  'img-gop-nang-4': { id: 'img-gop-nang-4', kind: 'image', url: gopNang4 },
  'img-gop-nang-5': { id: 'img-gop-nang-5', kind: 'image', url: gopNang5 },
  'img-gop-nang-6': { id: 'img-gop-nang-6', kind: 'image', url: gopNang6 },
  'img-gop-nang-7': { id: 'img-gop-nang-7', kind: 'image', url: gopNang7 },

  // Invented placeholder BCH-only documents (no real documents supplied yet) —
  // exercise the isBch-only visibility gate in ActivityDetail.
  'doc-hoi-thao-plan': { id: 'doc-hoi-thao-plan', kind: 'document', filename: 'Ke-hoach-to-chuc-hoi-thao.docx', size: '512 KB' },
  'doc-hoi-thao-list': { id: 'doc-hoi-thao-list', kind: 'document', filename: 'Danh-sach-tham-gia.xlsx', size: '64 KB' },
  'doc-lao-dong-plan': { id: 'doc-lao-dong-plan', kind: 'document', filename: 'Ke-hoach-lao-dong-hk3.docx', size: '340 KB' },
  'doc-gop-nang-plan': { id: 'doc-gop-nang-plan', kind: 'document', filename: 'Ke-hoach-gop-nang-cho-em.docx', size: '480 KB' },
  'doc-gop-nang-budget': { id: 'doc-gop-nang-budget', kind: 'document', filename: 'Du-tru-kinh-phi.xlsx', size: '96 KB' },
};

export function getMediaById(id: string): Media | undefined {
  return mediaLibrary[id];
}

export function isRealImage(id: string): boolean {
  const m = mediaLibrary[id];
  return m?.kind === 'image' && Boolean(m.url);
}

export function getEventImageUrl(id: string): string | undefined {
  return mediaLibrary[id]?.url;
}

// Registers a newly-created mock document (from DocumentPicker) into the shared
// library at session start so getMediaById can resolve it. Placeholder image ids
// ("placeholder-N") are intentionally not registered here — they're rendered by
// ActivityImage's gradient fallback, keyed directly off the id.
export function registerDocumentMedia(media: Media): void {
  mediaLibrary[media.id] = media;
}
