import { useEffect } from 'react';
import useInteraction from './useInteraction';

export default function useAudio(file = null, audio = null) {
  const interacted = useInteraction();

  useEffect(() => {
    async function createAudoContext() {
      const { Howl } = await import('howler');
      audio.current = new Howl({ src: [file] });
    }

    if (interacted && file) {
      createAudoContext();
    }

    return () => {
      if (audio.current) {
        // audio.current.unload();
      }
    };
  }, [interacted]);

  const ready = Boolean(interacted && audio);

  return { audio, ready };
}
