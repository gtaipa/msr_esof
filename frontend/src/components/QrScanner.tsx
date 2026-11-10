import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

// Leitor de QR com a câmara traseira. Fica fora da cobertura de testes porque
// depende de hardware real (câmara); a lógica de validação está em services/qr.ts e é testada.
interface Props {
  onLeitura: (texto: string) => void;
}

const ID_ELEMENTO = 'leitor-qr';

export default function QrScanner({ onLeitura }: Props) {
  const [ativo, setAtivo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const leitor = useRef<Html5Qrcode | null>(null);
  const callback = useRef(onLeitura);
  // Guarda sempre a versão mais recente do callback sem reiniciar a câmara.
  useEffect(() => {
    callback.current = onLeitura;
  }, [onLeitura]);

  useEffect(() => {
    if (!ativo) return;
    const instancia = new Html5Qrcode(ID_ELEMENTO);
    leitor.current = instancia;
    instancia
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 220 },
        (texto) => {
          callback.current(texto);
          setAtivo(false);
        },
        () => {
          /* frames sem QR: ignorar */
        },
      )
      .catch(() => {
        setErro('Não foi possível usar a câmara. Usa o código escrito abaixo.');
        setAtivo(false);
      });
    return () => {
      if (instancia.isScanning) void instancia.stop();
    };
  }, [ativo]);

  return (
    <section className="grupo">
      <div id={ID_ELEMENTO} style={{ width: '100%' }} />
      <button className="botao" type="button" onClick={() => { setErro(null); setAtivo((a) => !a); }}>
        {ativo ? 'Parar câmara' : 'Ler QR Code'}
      </button>
      {erro && <p className="erro">{erro}</p>}
    </section>
  );
}
