import React, { useState } from 'react';
import { DetectedBoundingBox } from '../types/argus';
import { Eye, EyeOff, Maximize2, Info, Flame, User, Cloud, Sparkles } from 'lucide-react';

interface Props {
  imageUrl: string;
  isAnalyzing: boolean;
  boundingBoxes: DetectedBoundingBox[];
  statusLabel?: string;
  isViolation?: boolean;
  onOpenFullscreen?: () => void;
  onOpenInfo?: () => void;
  hoveredIndex?: number | null;
  onHoverIndex?: (index: number | null) => void;
}

export const ImageHudViewer: React.FC<Props> = ({
  imageUrl,
  isAnalyzing,
  boundingBoxes,
  statusLabel,
  isViolation = false,
  onOpenFullscreen,
  onOpenInfo,
  hoveredIndex = null,
  onHoverIndex,
}) => {
  const [showBoxes, setShowBoxes] = useState(true);

  const getCategoryDetails = (category: string, label: string, isHovered: boolean) => {
    const isDevice =
      category === 'device' ||
      /вейп|сигарет|сигар|трубк|кальян|iqos|айкос|pod|электрон|vape|cigar|алкогол|бутылк|пив|вин/i.test(label);
    const isSmoke = category === 'smoke_vapor' || /пар|дым|smoke|vapor/i.test(label);
    const isFace = category === 'face' || /лицо|face/i.test(label);

    if (isDevice) {
      return {
        type: 'device',
        badgeTitle: 'Устройство',
        badgeIcon: Flame,
        border: isHovered
          ? 'border-pink-400 border-2 ring-4 ring-pink-500/30 shadow-[0_0_24px_rgba(236,72,153,0.7)]'
          : 'border-pink-500/90 border-2',
        bg: isHovered ? 'bg-pink-500/20' : 'bg-pink-500/10',
        cornerColor: 'border-pink-300',
        tag: isHovered
          ? 'bg-pink-600 text-white border-pink-300 shadow-lg scale-105 font-semibold'
          : 'bg-[#160b24]/95 text-pink-300 border-pink-500/50',
      };
    }

    if (isSmoke) {
      return {
        type: 'smoke',
        badgeTitle: 'Дым / Пар',
        badgeIcon: Cloud,
        border: isHovered
          ? 'border-purple-400 border-2 ring-4 ring-purple-500/30 shadow-[0_0_22px_rgba(192,132,252,0.65)]'
          : 'border-purple-400/90 border-2',
        bg: isHovered ? 'bg-purple-500/20' : 'bg-purple-500/10',
        cornerColor: 'border-purple-300',
        tag: isHovered
          ? 'bg-purple-600 text-white border-purple-300 shadow-lg scale-105 font-semibold'
          : 'bg-[#160b24]/95 text-purple-200 border-purple-500/50',
      };
    }

    if (isFace) {
      return {
        type: 'face',
        badgeTitle: 'Лицо',
        badgeIcon: User,
        border: isHovered
          ? 'border-amber-300 border-2 ring-4 ring-amber-400/35 shadow-[0_0_24px_rgba(251,191,36,0.7)]'
          : 'border-amber-400/90 border-2',
        bg: isHovered ? 'bg-amber-500/20' : 'bg-amber-500/10',
        cornerColor: 'border-amber-200',
        tag: isHovered
          ? 'bg-amber-500 text-[#12091c] border-amber-200 shadow-lg scale-105 font-bold'
          : 'bg-[#160b24]/95 text-amber-300 border-amber-500/50',
      };
    }

    return {
      type: 'other',
      badgeTitle: 'Объект',
      badgeIcon: Sparkles,
      border: isHovered
        ? 'border-emerald-400 border-2 ring-4 ring-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
        : 'border-emerald-500/80 border-2',
      bg: isHovered ? 'bg-emerald-500/20' : 'bg-emerald-500/10',
      cornerColor: 'border-emerald-300',
      tag: isHovered
        ? 'bg-emerald-600 text-white border-emerald-300 shadow-md scale-105 font-semibold'
        : 'bg-[#160b24]/95 text-emerald-300 border-emerald-500/50',
    };
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#11081b] border border-orange-500/25 select-none group shadow-inner">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-3 py-2 bg-gradient-to-b from-[#0d0615]/90 via-[#0d0615]/50 to-transparent flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
              isViolation
                ? 'bg-pink-500/25 text-pink-200 border-pink-500/50'
                : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
            }`}
          >
            {statusLabel || (isViolation ? 'Нарушение' : 'Норма')}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#170c26]/90 p-0.5 rounded-lg border border-orange-400/25">
          {onOpenInfo && (
            <button
              onClick={onOpenInfo}
              title="Параметры снимка"
              className="p-1 rounded-md text-amber-200/70 hover:text-amber-200 hover:bg-orange-500/20 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              title="На весь экран"
              className="p-1 rounded-md text-amber-200/70 hover:text-amber-200 hover:bg-orange-500/20 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            title={showBoxes ? 'Скрыть рамки объектов' : 'Показать рамки объектов'}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              showBoxes
                ? 'text-amber-200 bg-orange-500/25'
                : 'text-amber-200/50 hover:text-amber-200 hover:bg-orange-500/20'
            }`}
          >
            {showBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Image Frame */}
      <div className="relative aspect-[16/10] w-full bg-[#0e0717] flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="Анализируемый кадр"
          className="w-full h-full object-contain"
        />

        {/* Scanning Indicator */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-[#12091c]/70 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-30">
            <div className="px-4 py-2 rounded-xl bg-[#1f1131]/95 border border-orange-400/40 flex items-center gap-2.5 shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold text-amber-100">
                Анализ кадра «Аргус»...
              </span>
            </div>
          </div>
        )}

        {/* Interactive Bounding Boxes */}
        {showBoxes &&
          !isAnalyzing &&
          boundingBoxes.map((box, index) => {
            const [ymin, xmin, ymax, xmax] = box.box_2d;
            const top = `${(ymin / 1000) * 100}%`;
            const left = `${(xmin / 1000) * 100}%`;
            const width = `${((xmax - xmin) / 1000) * 100}%`;
            const height = `${((ymax - ymin) / 1000) * 100}%`;

            const isHovered = hoveredIndex === index;
            const isAnyHovered = hoveredIndex !== null;
            const details = getCategoryDetails(box.category, box.label, isHovered);
            const BadgeIcon = details.badgeIcon;
            const isNearTop = ymin < 65;

            return (
              <div
                key={index}
                onMouseEnter={() => onHoverIndex && onHoverIndex(index)}
                onMouseLeave={() => onHoverIndex && onHoverIndex(null)}
                className={`absolute rounded-lg pointer-events-auto cursor-pointer transition-all duration-200 ease-out ${
                  details.border
                } ${details.bg} ${
                  isHovered
                    ? 'z-40 scale-[1.02] opacity-100'
                    : isAnyHovered
                    ? 'z-10 opacity-30 scale-[0.99]'
                    : 'z-10 opacity-95'
                }`}
                style={{ top, left, width, height }}
              >
                {/* Corner Brackets */}
                <span
                  className={`absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2 rounded-tl-sm ${details.cornerColor}`}
                />
                <span
                  className={`absolute -top-[2px] -right-[2px] w-2.5 h-2.5 border-t-2 border-r-2 rounded-tr-sm ${details.cornerColor}`}
                />
                <span
                  className={`absolute -bottom-[2px] -left-[2px] w-2.5 h-2.5 border-b-2 border-l-2 rounded-bl-sm ${details.cornerColor}`}
                />
                <span
                  className={`absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2 rounded-br-sm ${details.cornerColor}`}
                />

                {/* Floating Tag */}
                <div
                  className={`absolute ${
                    isNearTop ? 'top-1 left-1' : '-top-6 left-0'
                  } text-[10px] px-2 py-0.5 rounded-md border whitespace-nowrap transition-all duration-200 flex items-center gap-1 ${
                    details.tag
                  } ${isHovered ? 'z-50 shadow-md' : 'z-20'}`}
                >
                  <BadgeIcon className="w-3 h-3 shrink-0" />
                  <span>{box.label}</span>
                  <span className="opacity-80 font-mono text-[9px]">{box.confidence}%</span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Status Bar */}
      <div className="px-3 py-1.5 bg-[#190d29]/95 border-t border-orange-500/20 text-[11px] text-amber-200/70 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>Детектор «Безопасный город»</span>
          {hoveredIndex !== null && boundingBoxes[hoveredIndex] && (
            <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-amber-200 text-[10px] font-medium">
              Выделен объект
            </span>
          )}
        </span>
        <span className="text-amber-100 truncate max-w-[65%] text-right font-mono text-[11px]">
          {hoveredIndex !== null && boundingBoxes[hoveredIndex]
            ? `${boundingBoxes[hoveredIndex].label} (${boundingBoxes[hoveredIndex].confidence}%)`
            : boundingBoxes.length > 0
            ? `Объектов: ${boundingBoxes.length}`
            : 'Готов'}
        </span>
      </div>
    </div>
  );
};
