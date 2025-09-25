import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import styles from './styles.module.scss';

const strings = {
  title: 'Asistente IA',
  typing: 'IA está escribiendo...',
  placeholder: 'Pregunta sobre negocios...',
  send: 'Enviar'
};

const ChatWidget: React.FC = () => {
  const { messages, isTyping, sendMessage } = useChat();
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
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
            <h4>{strings.title}</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className={styles.messages}>
            {messages.map(message => (
              <div key={message.id} className={`${styles.message} ${styles[message.sender]}`}>
                {message.message}
              </div>
            ))}
            {isTyping && <div className={styles.typing}>{strings.typing}</div>}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={strings.placeholder}
              className={styles.input}
            />
            <button onClick={handleSend} className={styles.sendButton}>{strings.send}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;