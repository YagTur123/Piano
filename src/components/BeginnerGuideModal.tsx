import React from 'react';
import { X, Play, Music, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo?: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onStartDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#18191f] border border-[#363842] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#282a32] bg-[#1d1f27]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Piyanoya Hoş Geldiniz! Ne Yapmalısınız?
              </h2>
              <p className="text-xs text-neutral-400">
                Hiç piyano bilmeseniz bile 3 kolay adımda çalmaya başlayabilirsiniz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white bg-[#252731] hover:bg-[#2e313d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-[#20222b] border border-[#2e303b] flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Klavyede Parlayan Altın Tuşu Bulun
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Aşağıdaki piyano klavyesinde <strong className="text-amber-400">sarı/turuncu ışıkla parlayan</strong> ve üzerinde <span className="underline">"👇 DOKUNUN"</span> yazan tuşa bakın.
              </p>
              <div className="mt-2.5 p-2 rounded-lg bg-[#14151a] border border-[#2b2d38] text-[11px] text-neutral-300 flex items-center gap-2">
                <span className="text-amber-400 font-bold">💡 İpucu:</span>
                <span>Piyanoda 2 siyah tuşun hemen solundaki beyaz tuş her zaman <strong>Merkez Do (C4)</strong> notasıdır.</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-[#20222b] border border-[#2e303b] flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Doğru Parmağınızı Kullanın (1 - 5 Sistemi)
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Piyanoda her parmağın bir numarası vardır. Tuşun üzerindeki etikette hangi parmağınızı kullanacağınız yazar:
              </p>

              {/* Hand Diagram Table */}
              <div className="grid grid-cols-5 gap-1.5 mt-2.5 text-center font-mono text-[11px]">
                <div className="p-2 rounded-md bg-[#16171d] border border-[#2e303c]">
                  <div className="font-bold text-amber-400">1</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Başparmak</div>
                </div>
                <div className="p-2 rounded-md bg-[#16171d] border border-[#2e303c]">
                  <div className="font-bold text-amber-400">2</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">İşaret</div>
                </div>
                <div className="p-2 rounded-md bg-[#16171d] border border-[#2e303c]">
                  <div className="font-bold text-amber-400">3</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Orta</div>
                </div>
                <div className="p-2 rounded-md bg-[#16171d] border border-[#2e303c]">
                  <div className="font-bold text-amber-400">4</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Yüzük</div>
                </div>
                <div className="p-2 rounded-md bg-[#16171d] border border-[#2e303c]">
                  <div className="font-bold text-amber-400">5</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Serçe</div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1.5">
                Örn: <strong>"Sağ 1"</strong> yazıyorsa sağ elinizin <strong>başparmağıyla</strong> o tuşa basın.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-[#20222b] border border-[#2e303b] flex gap-3.5 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Tuşa Dokunun ve Notaları Takip Edin
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Doğru tuşa bastığınızda gerçek bir akustik piyano sesi duyulur ve sistem otomatik olarak sıradaki notayı işaret eder. Yanlış tuşa basarsanız korkmayın; ekran size doğru tuşu göstermeye devam eder!
              </p>
            </div>
          </div>

          {/* Extra Help: Demo button */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#202430] to-[#1a1b24] border border-[#3b4155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Music className="w-4 h-4 text-[#0a84ff]" />
              <div>
                <div className="text-xs font-bold text-white">Parçanın nasıl ses çıkardığını duymak ister misiniz?</div>
                <div className="text-[11px] text-neutral-400">"Örnek Dinle" butonuna basarak parçayı önce sistemden dinleyebilirsiniz.</div>
              </div>
            </div>
            {onStartDemo && (
              <button
                onClick={() => {
                  onClose();
                  onStartDemo();
                }}
                className="gb-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Örneği Çal</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#282a32] bg-[#1d1f27] flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Anladım, Şimdi Çalmaya Başlayalım!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
