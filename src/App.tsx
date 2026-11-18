import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { TabBar, ToastHost } from './components/ui';
import { ProfileProvider, useProfiles } from './lib/profiles';
import { ensureMenuRecipes } from './lib/recipes';
import { AddFoodScreen } from './screens/AddFood';
import { CreditsScreen } from './screens/Credits';
import { DiaryScreen } from './screens/Diary';
import { FoodFormScreen } from './screens/FoodForm';
import { PlaceholderScreen } from './screens/Placeholder';
import { ProductsScreen } from './screens/Products';
import { ProfileScreen } from './screens/Profile';
import { RecipeDetailScreen } from './screens/RecipeDetail';
import { RecipeFormScreen } from './screens/RecipeForm';
import { RecipesScreen } from './screens/Recipes';
import { ScanScreen } from './screens/Scan';
import { SwipeScreen } from './screens/Swipe';
import { WelcomeScreen } from './screens/Welcome';

const TAB_PATHS = ['/', '/products', '/recipes', '/progress'];

function Shell() {
  const { current } = useProfiles();
  const location = useLocation();
  if (!current) return <WelcomeScreen />;
  const showTabs = TAB_PATHS.includes(location.pathname);
  return (
    <div className={'app' + (showTabs ? ' with-tabs' : '')}>
      <Routes>
        <Route path="/" element={<DiaryScreen key={current.id} />} />
        <Route path="/add" element={<AddFoodScreen />} />
        <Route path="/food/new" element={<FoodFormScreen key="new" />} />
        <Route path="/food/:id/edit" element={<FoodFormScreen />} />
        <Route path="/products" element={<ProductsScreen />} />
        <Route path="/recipes" element={<RecipesScreen />} />
        <Route path="/recipe/new" element={<RecipeFormScreen key="new" />} />
        <Route path="/recipe/:id" element={<RecipeDetailScreen />} />
        <Route path="/recipe/:id/edit" element={<RecipeFormScreen />} />
        <Route path="/swipe" element={<SwipeScreen />} />
        <Route path="/scan" element={<ScanScreen />} />
        <Route
          path="/progress"
          element={<PlaceholderScreen title="Прогресс" icon="📈" text="Вес, график и статистика за неделю и месяц появятся на четвёртом этапе." />}
        />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/credits" element={<CreditsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showTabs && <TabBar />}
      <ToastHost />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    ensureMenuRecipes();
  }, []);
  return (
    <HashRouter>
      <ProfileProvider>
        <Shell />
      </ProfileProvider>
    </HashRouter>
  );
}
