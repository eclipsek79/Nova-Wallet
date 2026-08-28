import { useCallback, useEffect, useState } from 'react';
import { telegramService } from '@/services/telegramService';

export function useTelegram() {
  const [available] = useState(() => telegramService.isAvailable());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => telegramService.getTheme());
  const [user] = useState(() => telegramService.resolveUser());

  useEffect(() => {
    telegramService.init();
  }, []);

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;
    const handler = () => setTheme(telegramService.getTheme());
    wa.onEvent('themeChanged', handler);
    return () => wa.offEvent('themeChanged', handler);
  }, []);

  const haptic = useCallback((style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    telegramService.haptic(style);
  }, []);

  const hapticNotify = useCallback((type: 'error' | 'success' | 'warning') => {
    telegramService.hapticNotify(type);
  }, []);

  return {
    available,
    theme,
    user,
    haptic,
    hapticNotify,
    hapticSelection: telegramService.hapticSelection,
    setMainButton: telegramService.setMainButton,
    hideMainButton: telegramService.hideMainButton,
    showBackButton: telegramService.showBackButton,
    hideBackButton: telegramService.hideBackButton,
    shareMessage: telegramService.shareMessage,
    openLink: telegramService.openLink,
  };
}
