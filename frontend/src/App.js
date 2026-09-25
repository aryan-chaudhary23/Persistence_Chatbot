import './App.css';
import { useState } from "react";
import Header from './components/header.js';
import Threads from './components/threads';
import Chats from './components/chats';
import Footer from './components/footer';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07070a] text-gray-300 flex flex-col">

      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Main Workspace */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close conversations"
            onClick={() => setSidebarOpen(false)}
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              backdrop-blur-[2px]
              md:hidden
            "
          />
        )}

        {/* Threads Sidebar / Mobile Drawer */}
        <div
          className={`
            fixed
            top-16
            bottom-0
            left-0
            z-50

            transform
            transition-transform
            duration-300
            ease-out

            md:relative
            md:top-auto
            md:bottom-auto
            md:z-auto
            md:translate-x-0

            ${sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            }
          `}
        >
          <Threads
            onThreadSelect={() => setSidebarOpen(false)}
          />
        </div>

        {/* Chat Area */}
        <Chats />

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
