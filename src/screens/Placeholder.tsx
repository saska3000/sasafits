import { Empty, TopBar } from '../components/ui';

export function PlaceholderScreen({ title, icon, text }: { title: string; icon: string; text: string }) {
  return (
    <div className="screen">
      <TopBar title={title} />
      <main className="content">
        <Empty icon={icon} title="Скоро">
          {text}
        </Empty>
      </main>
    </div>
  );
}
