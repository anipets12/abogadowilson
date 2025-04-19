import React, { useState, useEffect, useRef } from 'react';

interface TypeWriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
  className?: string;
  cursor?: boolean;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 60,
  delayBetweenTexts = 1500,
  className = '',
  cursor = true
}) => {
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isWaiting) return;

    const handleTypingEffect = () => {
      const currentIndex = textIndex % texts.length;
      const fullText = texts[currentIndex];

      // Tiempo de espera dependiendo de si está escribiendo o borrando
      const timeDelay = isDeleting ? deletingSpeed : typingSpeed;

      timeoutRef.current = setTimeout(() => {
        if (!isDeleting) {
          // Escribiendo
          if (currentText.length < fullText.length) {
            setCurrentText(fullText.substring(0, currentText.length + 1));
          } else {
            // Completó la escritura, espera antes de borrar
            setIsWaiting(true);
            timeoutRef.current = setTimeout(() => {
              setIsDeleting(true);
              setIsWaiting(false);
            }, delayBetweenTexts);
          }
        } else {
          // Borrando
          if (currentText.length > 0) {
            setCurrentText(fullText.substring(0, currentText.length - 1));
          } else {
            // Completó el borrado, prepara para el siguiente texto
            setIsDeleting(false);
            setTextIndex((prevIndex) => prevIndex + 1);
          }
        }
      }, timeDelay);
    };

    handleTypingEffect();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, delayBetweenTexts, isWaiting]);

  return (
    <span className={className}>
      {currentText}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default TypeWriter;
