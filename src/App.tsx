import { useEffect } from 'react';
import { AppProvider } from '@/context/AppContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTheme } from '@/hooks/useTheme';
import { telegramService } from '@/services/telegramService';
import { BottomNav } from '@/components/BottomNav';
import { Onboarding } from '@/screens/Onboarding';
import { HomeScreen } from '@/screens/HomeScreen';
import { WalletScreen } from '@/screens/WalletScreen';
import { SwapScreen } from '@/screens/SwapScreen';
import { ActivityScreen } from '@/screens/ActivityScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { AssetDetailScreen } from '@/screens/AssetDetailScreen';
import { ReceiveScreen } from '@/screens/ReceiveScreen';
import { SendScreen } from '@/screens/SendScreen';
import { TransactionDetailScreen } from '@/screens/TransactionDetailScreen';

function ScreenRouter() {
  const { route, navigate, goBack, canGoBack } = useRouter();
  const { showBackButton, hideBackButton } = useTelegram();

  useEffect(() => {
    if (canGoBack && route.name !== 'tab') {
      showBackButton(goBack);
    } else {
      hideBackButton();
    }
    return () => hideBackButton();
  }, [canGoBack, route, goBack, showBackButton, hideBackButton]);

  switch (route.name) {
    case 'tab':
      switch (route.tab) {
        case 'home':
          return <HomeScreen />;
        case 'wallet':
          return <WalletScreen />;
        case 'swap':
          return <SwapScreen />;
        case 'activity':
          return <ActivityScreen />;
        case 'settings':
          return <SettingsScreen />;
      }
      return <HomeScreen />;
    case 'asset':
      return <AssetDetailScreen assetId={route.assetId} />;
    case 'receive':
      return <ReceiveScreen assetId={route.assetId} />;
    case 'send':
      return <SendScreen assetId={route.assetId} />;
    case 'transaction':
      return <TransactionDetailScreen txId={route.txId} />;
    case 'onboarding':
      return null;
    default:
      return <HomeScreen />;
  }
}

function AppContent() {
  const { onboarded, completeOnboarding } = useOnboarding();
  const { route } = useRouter();
  const showBottomNav = route.name === 'tab';

  if (!onboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-nova-bg text-nova-text">
      <div className="mx-auto min-h-screen max-w-md">
        <ScreenRouter />
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  useTheme();
  const { available } = useTelegram();

  useEffect(() => {
    telegramService.init();
  }, []);

  return (
    <RouterProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </RouterProvider>
  );
}

export default App;
