import { BarcodeDetector, prepareZXingModule } from 'barcode-detector/ponyfill';
import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AmountSheet } from '../components/AmountSheet';
import { TopBar, toast, useGoBack } from '../components/ui';
import { addFoodEntry, setFavorite, useFavoriteIds } from '../lib/diary';
import { isValidDateStr, todayStr } from '../lib/format';
import { guessMeal, mealLabel } from '../lib/nutrition';
import { OffError, lookupBarcode, saveOffFood } from '../lib/off';
import { useCurrentProfile } from '../lib/profiles';
import type { Food, MealType } from '../lib/types';

// Движок распознавания лежит в самом приложении — работает без внешних серверов
prepareZXingModule({
  overrides: {
    locateFile: (path: string, prefix: string) => (path.endsWith('.wasm') ? wasmUrl : prefix + path),
  },
});

type State = 'starting' | 'scanning' | 'looking' | 'found' | 'nocamera';

export function ScanScreen() {
  const profile = useCurrentProfile();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const [params] = useSearchParams();
  const d = params.get('d');
  const date = isValidDateStr(d) ? d : todayStr();
  const meal = (params.get('meal') as MealType | null) ?? guessMeal();
  const favIds = useFavoriteIds(profile.id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const busy = useRef(false);
  const [state, setState] = useState<State>('starting');
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');
  const [food, setFood] = useState<Food | null>(null);
  const [added, setAdded] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleCode = useCallback(
    async (code: string) => {
      if (busy.current) return;
      busy.current = true;
      stopCamera();
      setState('looking');
      setError('');
      try {
        const res = await lookupBarcode(code);
        if (res && res.complete) {
          const f = res.where === 'off' ? await saveOffFood(res.food) : res.food;
          setFood(f);
          setState('found');
          return;
        }
        // Не нашли или в базе не хватает КБЖУ — открываем форму с тем, что знаем
        navigate(`/food/new?d=${date}&meal=${meal}&barcode=${encodeURIComponent(code)}`, {
          replace: true,
          state: {
            prefill: res?.food,
            hint: res
              ? 'Продукт нашёлся, но в базе не хватает КБЖУ. Допишите с упаковки — в следующий раз он найдётся сразу.'
              : 'Такого продукта ещё нет в базе. Введите КБЖУ с упаковки — в следующий раз он найдётся по штрих-коду.',
          },
        });
      } catch (e) {
        setError(e instanceof OffError ? e.message : 'Что-то пошло не так. Попробуйте ещё раз.');
        busy.current = false;
        setState('nocamera');
      }
    },
    [date, meal, navigate],
  );

  // Камера и распознавание
  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    busy.current = false;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          window.isSecureContext
            ? 'Этот браузер не даёт доступ к камере. Введите цифры штрих-кода вручную.'
            : 'Камера работает только по защищённому адресу (https). Введите цифры штрих-кода вручную.',
        );
        setState('nocamera');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        setState('scanning');
        const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
        const tick = async () => {
          if (cancelled || busy.current) return;
          try {
            if (video.readyState >= 2) {
              const codes = await detector.detect(video);
              const code = codes.find((c) => /^\d{8,14}$/.test(c.rawValue))?.rawValue;
              if (code && !cancelled) {
                handleCode(code);
                return;
              }
            }
          } catch {
            /* кадр не прочитался — пробуем следующий */
          }
          timer = window.setTimeout(tick, 120);
        };
        tick();
      } catch (e) {
        const name = (e as Error).name;
        setError(
          name === 'NotAllowedError'
            ? 'Нет доступа к камере. Разрешите камеру для этого сайта в настройках браузера — или введите цифры вручную.'
            : 'Не получилось включить камеру. Введите цифры штрих-кода вручную.',
        );
        setState('nocamera');
      }
    })();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      stopCamera();
    };
  }, [handleCode, restartKey]);

  const scanAgain = () => {
    setFood(null);
    setState('starting');
    setRestartKey((k) => k + 1);
  };

  const submitManual = () => {
    const code = manual.replace(/\D/g, '');
    if (code.length < 8) {
      setError('В штрих-коде обычно 13 цифр — проверьте.');
      return;
    }
    busy.current = false;
    handleCode(code);
  };

  return (
    <div className="screen">
      <TopBar
        back={`/?d=${date}`}
        title={
          <div className="add-title">
            <div>Сканер · {mealLabel(meal)}</div>
            {added > 0 && <div className="muted small">добавлено: {added}</div>}
          </div>
        }
        right={
          added > 0 ? (
            <button className="btn small primary" onClick={() => goBack(`/?d=${date}`, 2)}>
              Готово
            </button>
          ) : (
            <span className="topbar-spacer" />
          )
        }
      />
      <main className="content">
        <div className={'scanner' + (state === 'scanning' ? ' live' : '')}>
          <video ref={videoRef} playsInline muted autoPlay />
          <div className="scanner-frame">
            <span className="scanner-line" />
          </div>
          {state !== 'scanning' && (
            <div className="scanner-status">
              {state === 'starting' && 'Включаю камеру…'}
              {state === 'looking' && 'Ищу продукт…'}
              {state === 'found' && 'Нашёлся!'}
              {state === 'nocamera' && 'Камера выключена'}
            </div>
          )}
        </div>
        <div className="muted small center">Наведите камеру на штрих-код — он считается сам</div>

        {error && <div className="hint">{error}</div>}
        {!window.isSecureContext && (
          // Пробный адрес в домашней сети без https — предлагаем защищённую версию (npm run dev:https)
          <a className="btn primary" href={`https://${location.hostname}:5443/${location.hash}`}>
            Открыть защищённую версию с камерой
          </a>
        )}
        {state === 'nocamera' && (
          <button className="btn outline" onClick={scanAgain}>
            Попробовать камеру снова
          </button>
        )}

        <div className="label">Или введите цифры под штрих-кодом</div>
        <div className="manual-row">
          <input
            className="input"
            inputMode="numeric"
            placeholder="4600605029343"
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitManual()}
          />
          <button className="btn primary" onClick={submitManual}>
            Найти
          </button>
        </div>
      </main>

      {food && (
        <AmountSheet
          open
          onClose={scanAgain}
          name={food.name}
          subtitle={[food.brand, food.barcode].filter(Boolean).join(' · ')}
          per100={food}
          servings={food.servings}
          tags={food.tags}
          meal={meal}
          submitLabel="Добавить"
          favorite={favIds?.has(food.id)}
          onToggleFavorite={() => setFavorite(profile.id, food.id, !favIds?.has(food.id))}
          onEdit={() => navigate(`/food/${food.id}/edit`)}
          onSubmit={async (r) => {
            await addFoodEntry({ profileId: profile.id, date, meal: r.meal, food, amount: r.amount, unit: r.unit });
            setAdded((n) => n + 1);
            toast(`Добавлено: ${food.name}. Можно сканировать следующий`);
            scanAgain();
          }}
        />
      )}
    </div>
  );
}
