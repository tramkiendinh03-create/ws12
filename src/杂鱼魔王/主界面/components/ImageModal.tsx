import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, altText, onClose }) => {
  // 按 ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        className="absolute top-4 right-4 z-60 rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white"
        onClick={onClose}
      >
        <X size={24} />
      </button>

      {/* 图片容器 */}
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 发光效果 */}
        <div className="from-crimson-500/20 absolute inset-0 -z-10 bg-gradient-to-br to-purple-500/20 blur-3xl"></div>

        {/* 图片 */}
        <img
          src={imageUrl}
          alt={altText}
          className="max-h-[85vh] max-w-[85vw] rounded-xl border border-white/20 object-contain shadow-2xl"
        />

        {/* 角色名称标签 */}
        <div className="bg-void-900/80 absolute bottom-0 left-0 right-0 rounded-b-xl border-t border-white/10 px-4 py-2 text-center backdrop-blur-sm">
          <span className="font-display bg-gradient-to-r from-crimson-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
            {altText}
          </span>
        </div>
      </div>

      {/* 点击关闭提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-400">点击任意位置关闭</div>
    </div>
  );
};
