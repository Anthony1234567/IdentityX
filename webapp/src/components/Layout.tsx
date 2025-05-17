// src/components/Layout.tsx
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
