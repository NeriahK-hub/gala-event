import React, { useState } from 'react';
import { useContent } from '../../content/ContentContext';
import { SectionHeader } from '../common/SectionHeader';
import { GalleryItem } from '../../types';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { content, t } = useContent();
  const GALLERY_ITEMS = content.gallery;
  if (GALLERY_ITEMS.length === 0) return null;
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleOpenPhoto = (item: GalleryItem, index: number) => {
    setSelectedPhoto(item);
    setSelectedIndex(index);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = selectedIndex > 0 ? selectedIndex - 1 : GALLERY_ITEMS.length - 1;
    setSelectedIndex(newIdx);
    setSelectedPhoto(GALLERY_ITEMS[newIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIdx = selectedIndex < GALLERY_ITEMS.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIdx);
    setSelectedPhoto(GALLERY_ITEMS[newIdx]);
  };

  return (
    <section id="galerie" className="relative scroll-mt-20 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeader kicker={t('gallery.kicker')} title={t('gallery.title')} subtitle={t('gallery.subtitle')} />

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GALLERY_ITEMS.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleOpenPhoto(item, index)}
            className="group relative rounded-3xl ring-1 ring-white/15 overflow-hidden aspect-[4/3] cursor-pointer shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-500"
          >
            <img
              loading="lazy"
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
            />

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D030B] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Hover Overlay Info */}
            <div className="absolute inset-0 p-5 flex flex-col justify-between opacity-90 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-[#2E0207]/80 border border-[#D4A857]/40 text-xs uppercase tracking-wider text-[#F3E5AB]">
                  {item.category}
                </span>
                <span className="w-8 h-8 rounded-full bg-[#2E0207]/80 border border-[#D4A857]/40 flex items-center justify-center text-[#E8C98A] group-hover:scale-110 transition-transform">
                  <Eye className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="font-sans font-bold tracking-tight text-lg text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 mt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-[#2E0207]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl border border-[#D4A857]/50 bg-[#3D030B] shadow-[0_0_50px_rgba(212,168,87,0.3)] overflow-hidden flex flex-col"
          >
            {/* Top Bar with Close button */}
            <div className="p-4 flex items-center justify-between border-b border-[#D4A857]/20">
              <span className="text-xs uppercase tracking-widest text-[#E8C98A]">
                {selectedPhoto.category} • Photo {selectedIndex + 1}/{GALLERY_ITEMS.length}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 rounded-full text-[#E8C98A] hover:bg-[#D4A857]/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo View with Next/Prev arrows */}
            <div className="relative flex-1 bg-black/60 flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />

              <button
                onClick={handlePrev}
                className="absolute left-3 p-2 rounded-full bg-[#2E0207]/80 border border-[#D4A857]/50 text-[#E8C98A] hover:scale-110 transition-transform cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 p-2 rounded-full bg-[#2E0207]/80 border border-[#D4A857]/50 text-[#E8C98A] hover:scale-110 transition-transform cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Caption Footer */}
            <div className="p-5 border-t border-[#D4A857]/20 bg-[#3D030B]">
              <h4 className="font-sans font-bold tracking-tight text-xl text-white">
                {selectedPhoto.title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
