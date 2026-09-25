
import React, { useEffect } from "react";
import { useStore } from "../context/StoreContext";

const Threads = ({ onThreadSelect }) => {
  const {
    threads,
    currentThread,
    setCurrentThread,
    setThreads,
    setMessages,
    fetchThreads,
    deleteThread,
    fetchMessages,
  } = useStore();

  // Fetch all threads when component loads
  useEffect(() => {
    fetchThreads();
  }, []);

  // =====================================================
  // SELECT EXISTING THREAD
  // =====================================================

  const handleSelectThread = async (thread) => {
    console.log("Selected thread:", thread);

    // Set the selected thread
    setCurrentThread(thread);

    // Fetch all messages belonging to this thread
    await fetchMessages(thread.thread_id);

    // Close mobile sidebar
    onThreadSelect?.();
  };

  // =====================================================
  // START NEW CHAT
  // =====================================================

  const handleNewChat = () => {
    console.log("Starting new chat");

    // No thread exists yet
    setCurrentThread(null);

    // Clear messages from previously selected thread
    setMessages([]);

    // Close mobile sidebar
    onThreadSelect?.();
  };

  // =====================================================
  // DELETE THREAD
  // =====================================================

  const handleDeleteThread = async (threadId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this thread?"
    );

    if (!confirmed) return;

    try {
      // Delete from backend
      await deleteThread(threadId);

      // Remove from local state
      setThreads((prevThreads) =>
        prevThreads.filter(
          (thread) => thread.thread_id !== threadId
        )
      );

      // If this was the currently selected thread
      if (currentThread?.thread_id === threadId) {
        setCurrentThread(null);
        setMessages([]);
      }

    } catch (error) {
      console.error("Error deleting thread:", error);
    }
  };

  return (
    <aside
      className="
        relative
        h-full
        w-[280px]
        sm:w-72
        shrink-0
        overflow-hidden

        bg-[#08080c]
        border-r border-white/[0.06]

        flex
        flex-col
        min-h-0
      "
    >

      {/* ================================================= */}
      {/* AMBIENT LIGHTING */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -top-32
          -left-20
          h-72
          w-72
          rounded-full
          bg-violet-600/[0.055]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          top-1/3
          -right-32
          h-64
          w-64
          rounded-full
          bg-cyan-500/[0.025]
          blur-3xl
        "
      />


      {/* ================================================= */}
      {/* SIDEBAR HEADER */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          px-3
          sm:px-4
          pt-4
          sm:pt-5
          pb-3
          sm:pb-4

          border-b
          border-white/[0.06]

          shrink-0
        "
      >

        <div className="flex items-center justify-between">

          {/* Title */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">

            <div
              className="
                relative
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg

                border
                border-violet-400/15
                bg-violet-500/[0.05]
              "
            >

              <div
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-violet-400

                  shadow-[0_0_9px_rgba(167,139,250,0.8)]
                "
              />

              <div
                className="
                  absolute
                  h-4
                  w-4
                  rounded-full
                  border
                  border-violet-400/10
                "
              />

            </div>


            <div className="min-w-0">

              <h2
                className="
                  truncate
                  text-[10px]
                  sm:text-[11px]
                  font-semibold
                  tracking-[0.16em]
                  sm:tracking-[0.2em]
                  text-gray-300
                "
              >
                THREADS
              </h2>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[7px]
                  sm:text-[8px]
                  tracking-[0.14em]
                  sm:tracking-[0.18em]
                  uppercase
                  text-gray-700
                "
              >
                Memory Stream
              </p>

            </div>

          </div>


          {/* Thread count */}
          <div
            className="
              shrink-0
              rounded-md
              border
              border-white/[0.06]
              bg-white/[0.025]
              px-1.5
              sm:px-2
              py-1
            "
          >
            <span
              className="
                text-[8px]
                sm:text-[9px]
                font-mono
                text-violet-400/70
              "
            >
              {threads.length.toString().padStart(2, "0")}
            </span>
          </div>

        </div>


        {/* ================================================= */}
        {/* NEW CHAT BUTTON */}
        {/* ================================================= */}

        <button
          onClick={handleNewChat}
          className="
            group
            relative
            mt-3
            sm:mt-4

            w-full
            h-9
            sm:h-10

            overflow-hidden

            flex
            items-center
            justify-center
            gap-1.5
            sm:gap-2

            rounded-lg

            border
            border-white/[0.08]

            bg-white/[0.025]

            text-gray-500

            text-[8px]
            sm:text-[9px]

            tracking-[0.15em]
            sm:tracking-[0.2em]

            hover:border-violet-400/25
            hover:bg-violet-500/[0.055]
            hover:text-violet-300

            active:scale-[0.98]

            transition-all
            duration-200
          "
        >

          {/* Hover sweep */}
          <span
            className="
              pointer-events-none
              absolute
              inset-0
              -translate-x-full

              bg-gradient-to-r
              from-transparent
              via-violet-400/[0.07]
              to-transparent

              transition-transform
              duration-500

              group-hover:translate-x-full
            "
          />

          <span
            className="
              relative
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center

              rounded-md
              border
              border-violet-400/15
              bg-violet-500/[0.06]

              text-violet-400
              text-sm
              leading-none
            "
          >
            +
          </span>

          <span className="relative">
            <span className="hidden min-[380px]:inline">
              NEW CONVERSATION
            </span>

            <span className="min-[380px]:hidden">
              NEW CHAT
            </span>
          </span>

        </button>

      </div>


      {/* ================================================= */}
      {/* THREAD LIST */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          flex-1
          min-h-0

          overflow-y-auto

          p-2
          sm:p-3

          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-white/[0.08]
        "
      >

        {threads.length === 0 ? (

          /* ================================================= */
          /* EMPTY */
          /* ================================================= */

          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center

              text-center

              px-3
              sm:px-4
            "
          >

            <div
              className="
                relative
                flex
                h-10
                sm:h-12
                w-10
                sm:w-12

                items-center
                justify-center

                rounded-xl

                border
                border-white/[0.06]
                bg-white/[0.02]

                mb-3
                sm:mb-4
              "
            >

              <div
                className="
                  absolute
                  inset-2
                  rounded-lg
                  border
                  border-dashed
                  border-violet-400/10
                "
              />

              <span
                className="
                  relative
                  text-base
                  sm:text-lg
                  text-gray-700
                "
              >
                ∅
              </span>

            </div>


            <p className="text-[11px] sm:text-xs text-gray-600">
              No conversations yet
            </p>

            <p
              className="
                mt-1

                text-[7px]
                sm:text-[8px]

                tracking-[0.14em]
                sm:tracking-[0.18em]

                text-gray-800
              "
            >
              CREATE A NEW SESSION
            </p>

          </div>

        ) : (

          /* ================================================= */
          /* THREADS */
          /* ================================================= */

          <div className="space-y-1.5">

            {threads.map((thread) => {

              const isActive =
                currentThread?.thread_id === thread.thread_id;

              return (
                <div
                  key={thread.thread_id}
                  className={`
                    group
                    relative
                    overflow-hidden

                    rounded-xl
                    border

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-violet-500/[0.09]
                          to-transparent

                          border-violet-400/20

                          shadow-[inset_0_0_25px_rgba(139,92,246,0.035)]
                        `
                        : `
                          bg-transparent
                          border-transparent

                          hover:bg-white/[0.025]
                          hover:border-white/[0.06]
                        `
                    }
                  `}
                >

                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="
                        absolute
                        left-0
                        top-2.5
                        bottom-2.5

                        w-[2px]

                        rounded-r-full

                        bg-violet-400

                        shadow-[0_0_10px_rgba(167,139,250,0.8)]
                      "
                    />
                  )}


                  {/* Active ambient glow */}
                  {isActive && (
                    <div
                      className="
                        pointer-events-none
                        absolute

                        -left-8
                        top-1/2

                        h-16
                        w-16

                        -translate-y-1/2

                        rounded-full

                        bg-violet-500/[0.08]
                        blur-2xl
                      "
                    />
                  )}


                  {/* ================================================= */}
                  {/* THREAD BUTTON */}
                  {/* ================================================= */}

                  <button
                    onClick={() => handleSelectThread(thread)}
                    className="
                      relative
                      z-10

                      w-full
                      text-left

                      px-3
                      sm:px-3.5

                      py-2.5
                      sm:py-3

                      pr-10
                    "
                  >

                    {/* Title */}
                    <div
                      className={`
                        truncate

                        text-[11px]
                        sm:text-[12px]

                        transition-colors

                        ${
                          isActive
                            ? "text-gray-200"
                            : "text-gray-400 group-hover:text-gray-200"
                        }
                      `}
                    >
                      {thread.title}
                    </div>


                    {/* Metadata */}
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        sm:gap-2

                        mt-1.5

                        min-w-0
                      "
                    >

                      <span
                        className={`
                          truncate
                          max-w-[65px]
                          sm:max-w-[80px]

                          text-[7px]
                          sm:text-[8px]

                          font-mono
                          tracking-wider

                          ${
                            isActive
                              ? "text-violet-400/60"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {thread.thread_id.slice(0, 8)}
                      </span>

                      <span className="shrink-0 text-gray-800 text-[7px]">
                        •
                      </span>

                      <span
                        className="
                          shrink-0
                          text-[7px]
                          sm:text-[8px]
                          text-gray-700
                        "
                      >
                        {new Date(
                          thread.updated_at
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  </button>


                  {/* ================================================= */}
                  {/* DELETE */}
                  {/* ================================================= */}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDeleteThread(
                        thread.thread_id
                      );
                    }}
                    className="
                      absolute
                      z-20

                      right-1.5
                      sm:right-2

                      top-1/2
                      -translate-y-1/2

                      flex
                      h-7
                      w-7

                      items-center
                      justify-center

                      rounded-lg

                      border
                      border-transparent

                      text-gray-700

                      opacity-0
                      group-hover:opacity-100

                      hover:border-red-400/10
                      hover:bg-red-500/[0.06]
                      hover:text-red-400

                      transition-all
                      duration-150
                    "
                    title="Delete thread"
                  >
                    ×
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* BOTTOM STATUS */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          px-3
          sm:px-4

          py-3
          sm:py-3.5

          border-t
          border-white/[0.06]

          shrink-0

          bg-black/10
        "
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2 min-w-0">

            <div
              className="
                flex
                h-5
                w-5
                shrink-0

                items-center
                justify-center

                rounded-md

                bg-cyan-400/[0.05]
                border
                border-cyan-400/10
              "
            >

              <div
                className="
                  h-1.5
                  w-1.5

                  rounded-full

                  bg-cyan-400

                  shadow-[0_0_7px_rgba(34,211,238,0.7)]
                "
              />

            </div>

            <span
              className="
                truncate

                text-[7px]
                sm:text-[8px]

                tracking-[0.14em]

                text-gray-700
              "
            >
              MEMORY
            </span>

          </div>


          <span
            className="
              shrink-0

              text-[7px]
              sm:text-[8px]

              tracking-[0.12em]

              text-cyan-400/50
            "
          >
            SYNCED
          </span>

        </div>

      </div>

    </aside>
  );
};

export default Threads;
