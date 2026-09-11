import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { encrypt, decrypt } from '../utils/encryption';

export interface ApiKeys {
  openai?: string;
  elevenlabs?: string;
  heygen?: string;
  runway?: string;
  did?: string;
  // Additional free models & resources
  deepseek?: string;
  expo_robot?: string;
  openrouter?: string;
  moonshot?: string;
  sendgrid?: string;
  ollama?: string;
}

interface ApiKeyContextType {
  keys: ApiKeys;
  setKey: (service: keyof ApiKeys, key: string) => void;
  getKey: (service: keyof ApiKeys) => string | undefined;
  clearAll: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  keys: {},
  setKey: () => {},
  getKey: () => '',
  clearAll: () => {},
});

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [keys, setKeys] = useState<ApiKeys>({});

  useEffect(() => {
    const saved = localStorage.getItem('vf_api_keys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const decrypted = Object.fromEntries(
          Object.entries(parsed).map(([k, v]) => [k, decrypt(v as string)])
        );
        setKeys(decrypted);
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const save = (newKeys: ApiKeys) => {
    const encrypted = Object.fromEntries(
      Object.entries(newKeys).map(([k, v]) => [k, v ? encrypt(v) : ''])
    );
    localStorage.setItem('vf_api_keys', JSON.stringify(encrypted));
    setKeys(newKeys);
  };

  return (
    <ApiKeyContext.Provider value={{
      keys,
      setKey: (svc, key) => save({ ...keys, [svc]: key }),
      getKey: (svc) => keys[svc],
      clearAll: () => (localStorage.removeItem('vf_api_keys'), setKeys({}))
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => useContext(ApiKeyContext);