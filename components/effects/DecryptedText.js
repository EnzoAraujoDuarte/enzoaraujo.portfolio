import { useState, useEffect, useRef, memo } from 'react';

// Key para armazenar no sessionStorage se a animação já foi executada
const ANIMATION_PLAYED_KEY = 'decrypted_text_played';

/**
 * DecryptedText - Text animation that reveals characters with a decryption effect
 * Only plays once per session (when user first opens the portfolio)
 */
const DecryptedText = memo(function DecryptedText({
  text = '',
  speed = 3,
  delay = 0,
  className = '',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  id = 'default', // Identificador único para cada instância
}) {
  const [displayText, setDisplayText] = useState(text);
  const hasStarted = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Verifica se a animação já foi executada nesta sessão
    const hasPlayed = sessionStorage.getItem(`${ANIMATION_PLAYED_KEY}_${id}`);

    if (hasPlayed) {
      // Se já executou, mostra o texto final imediatamente
      setDisplayText(text);
      return;
    }

    if (!text || hasStarted.current) return;

    const getRandomChar = () => {
      return characters[Math.floor(Math.random() * characters.length)];
    };

    const startAnimation = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;

      let currentIndex = 0;
      let iteration = 0;
      const maxIterationsPerChar = 2; // Reduzido para ser mais rápido

      intervalRef.current = setInterval(() => {
        let result = '';

        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            result += ' ';
          } else if (i < currentIndex) {
            result += text[i];
          } else if (i === currentIndex) {
            if (iteration >= maxIterationsPerChar) {
              result += text[i];
            } else {
              result += getRandomChar();
            }
          } else {
            result += getRandomChar();
          }
        }

        setDisplayText(result);
        iteration++;

        if (iteration > maxIterationsPerChar) {
          currentIndex++;
          iteration = 0;
        }

        if (currentIndex >= text.length) {
          clearInterval(intervalRef.current);
          setDisplayText(text);
          // Marca como executada nesta sessão
          sessionStorage.setItem(`${ANIMATION_PLAYED_KEY}_${id}`, 'true');
        }
      }, speed);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, delay, characters, id]);

  // Atualiza o texto quando o idioma muda
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem(`${ANIMATION_PLAYED_KEY}_${id}`);
    if (hasPlayed) {
      setDisplayText(text);
    }
  }, [text, id]);

  return (
    <span className={className} aria-label={text}>
      {displayText}
    </span>
  );
});

export default DecryptedText;
