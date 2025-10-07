import React, { useState } from 'react';
import { submitDirectorioSolicitud } from '../../services/api';
import styles from './styles.module.scss';

const strings = {
  title: 'El Asistente IA está temporalmente inactivo. Puedes contactarme enviando una solicitud por este medio. Agrega Whatsapp o correo electronico para responderte ¡Estare encantado de ayudarte!',
  subtitle: '',
  placeholder: 'Escribe tu solicitud aquí...',
  send: 'Enviar Solicitud',
  thankYouTitle: '¡Gracias por contactarme!',
  thankYouMessage: 'El administrador del sitio se contactara contigo tan pronto revise el mensaje. ¡Gracias por tu paciencia!'
};

const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (message.trim()) {
      setIsLoading(true);
      try {
        await submitDirectorioSolicitud(message.trim());
        setIsSubmitted(true);
        setMessage('');
      } catch (error) {
        console.error('Error submitting solicitud:', error);
        alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
    setMessage('');
  };

  return (
    <div className={styles.chatWidget}>
      {!isOpen && (
        <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div>
              <h4>{strings.title}</h4>
              <p className={styles.subtitle}>{strings.subtitle}</p>
            </div>
            <button onClick={handleClose}>×</button>
          </div>
          <div className={styles.content}>
            {isSubmitted ? (
              <div className={styles.thankYou}>
                <h4>{strings.thankYouTitle}</h4>
                <p>{strings.thankYouMessage}</p>
              </div>
            ) : (
              <>
                <div className={styles.inputArea}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={strings.placeholder}
                    className={styles.textarea}
                    rows={4}
                  />
                </div>
                <div className={styles.buttonArea}>
                  <button
                    onClick={handleSubmit}
                    className={styles.sendButton}
                    disabled={!message.trim() || isLoading}
                  >
                    {isLoading ? 'Enviando...' : strings.send}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;