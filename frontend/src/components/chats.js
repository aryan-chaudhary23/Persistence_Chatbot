import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

const Messages = () => {
  const {
    messages,
    currentThread,
    setCurrentThread,
    setMessages,
    fetchMessages,
    fetchThreads,
  } = useStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // NEW CHAT
      // =====================================================

      if (currentThread === null) {
        const response = await fetch(
          "http://127.0.0.1:8000/new_chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create new chat");
        }

        const data = await response.json();

        console.log("New chat response:", data);

        const newThreadId = data.thread_id;

        /*
         * Backend created the thread and generated
         * the assistant response.
         *
         * We already know both messages, so add them
         * directly to React state.
         */

        setMessages([
          {
            id: `user-${Date.now()}`,
            thread_id: newThreadId,
            role: "user",
            content: message,
          },
          {
            id: `assistant-${Date.now()}`,
            thread_id: newThreadId,
            role: "assistant",
            content: data.assistant_message,
          },
        ]);

        /*
         * Refresh threads because a new thread was
         * created in the database.
         */

        const updatedThreads = await fetchThreads();

        const newThread = updatedThreads.find(
          (thread) => thread.thread_id === newThreadId
        );

        if (newThread) {
          setCurrentThread(newThread);
        }
      }

      // =====================================================
      // EXISTING CHAT
      // =====================================================

      else {
        const threadId = currentThread.thread_id;

        const response = await fetch(
          "http://127.0.0.1:8000/old_chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message,
              thread_id: threadId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        console.log("Old chat response:", data);

        /*
         * IMPORTANT:
         *
         * DO NOT call fetchMessages() here.
         *
         * We already have the old messages in state.
         * Just append the new user + assistant messages.
         */

        setMessages((prevMessages) => [
          ...prevMessages,

          {
            id: `user-${Date.now()}`,
            thread_id: threadId,
            role: "user",
            content: message,
          },

          {
            id: `assistant-${Date.now()}`,
            thread_id: threadId,
            role: "assistant",
            content: data.assistant_message,
          },
        ]);
      }

      setInput("");

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="
        relative

        flex-1
        min-w-0
        min-h-0

        flex
        flex-col

        overflow-hidden

        bg-[#09090d]
      "
    >

      {/* ================================================= */}
      {/* AMBIENT BACKGROUND */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute

          -top-40
          left-1/3

          h-80
          w-80
          sm:h-96
          sm:w-96

          rounded-full

          bg-violet-600/[0.035]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute

          bottom-0
          right-0

          h-64
          w-64
          sm:h-80
          sm:w-80

          rounded-full

          bg-cyan-500/[0.025]
          blur-3xl
        "
      />


      {/* ================================================= */}
      {/* CHAT HEADER */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          h-14
          sm:h-16

          shrink-0

          border-b
          border-white/[0.06]

          px-3
          sm:px-4
          md:px-6

          flex
          items-center
          justify-between

          bg-[#09090d]/80
          backdrop-blur-xl
        "
      >

        {currentThread ? (

          <div
            className="
              min-w-0
              flex
              items-center
              gap-2.5
              sm:gap-3
            "
          >

            {/* Thread avatar */}
            <div
              className="
                relative

                flex
                h-8
                w-8
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
                  h-2
                  w-2

                  rounded-full

                  bg-violet-400

                  shadow-[0_0_10px_rgba(167,139,250,0.8)]
                "
              />

            </div>


            <div className="min-w-0">

              <h2
                className="
                  max-w-[45vw]
                  sm:max-w-[50vw]
                  md:max-w-[55vw]
                  lg:max-w-[600px]

                  truncate

                  text-[11px]
                  sm:text-[13px]

                  font-medium

                  text-gray-300
                "
              >
                {currentThread.title}
              </h2>


              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  sm:gap-2

                  mt-1

                  min-w-0
                "
              >

                <span
                  className="
                    max-w-[120px]
                    sm:max-w-[220px]

                    truncate

                    text-[7px]
                    sm:text-[8px]

                    font-mono
                    tracking-wider

                    text-violet-400/50
                  "
                >
                  {currentThread.thread_id}
                </span>

                <span
                  className="
                    h-2.5
                    w-px
                    shrink-0
                    bg-white/[0.07]
                  "
                />

                <span
                  className="
                    shrink-0

                    text-[7px]
                    sm:text-[8px]

                    tracking-[0.14em]

                    text-cyan-400/40

                    uppercase
                  "
                >
                  active
                </span>

              </div>

            </div>

          </div>

        ) : (

          <div
            className="
              flex
              items-center
              gap-2.5
              sm:gap-3
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                shrink-0

                items-center
                justify-center

                rounded-lg

                border
                border-white/[0.07]

                bg-white/[0.025]
              "
            >
              <span className="text-sm text-gray-700">
                +
              </span>
            </div>


            <div>

              <h2
                className="
                  text-[10px]
                  sm:text-[12px]

                  tracking-[0.1em]
                  sm:tracking-[0.12em]

                  text-gray-500
                "
              >
                NEW SESSION
              </h2>

              <p
                className="
                  mt-1

                  text-[7px]
                  sm:text-[8px]

                  tracking-[0.14em]
                  sm:tracking-[0.16em]

                  text-gray-800
                "
              >
                READY FOR INPUT
              </p>

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* CONTEXT TELEMETRY */}
        {/* ================================================= */}

        <div
          className="
            hidden
            sm:flex

            shrink-0

            items-center
            gap-2
          "
        >

          <span
            className="
              text-[8px]
              tracking-[0.16em]
              text-gray-700
            "
          >
            CONTEXT
          </span>

          <span
            className="
              rounded-md

              border
              border-white/[0.06]

              bg-white/[0.02]

              px-2
              py-1

              font-mono

              text-[8px]

              text-violet-400/50
            "
          >
            {messages.length.toString().padStart(2, "0")}
          </span>

        </div>

      </div>


      {/* ================================================= */}
      {/* MESSAGES */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          flex-1
          min-h-0

          overflow-y-auto
          overflow-x-hidden

          px-3
          sm:px-4
          md:px-6

          py-6
          sm:py-8

          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-white/[0.08]
        "
      >

        {messages.length === 0 ? (

          /* ================================================= */
          /* EMPTY STATE */
          /* ================================================= */

          <div
            className="
              h-full

              flex
              items-center
              justify-center
            "
          >

            <div
              className="
                relative

                flex
                flex-col
                items-center

                text-center

                -mt-8
                sm:-mt-10

                px-4
              "
            >

              {/* Ambient glow */}
              <div
                className="
                  pointer-events-none

                  absolute
                  top-1/2
                  left-1/2

                  h-32
                  w-32
                  sm:h-40
                  sm:w-40

                  -translate-x-1/2
                  -translate-y-1/2

                  rounded-full

                  bg-violet-500/[0.05]

                  blur-3xl
                "
              />


              {/* Neural core */}
              <div
                className="
                  relative

                  flex

                  h-16
                  w-16

                  sm:h-20
                  sm:w-20

                  items-center
                  justify-center

                  rounded-2xl

                  border
                  border-violet-400/10

                  bg-gradient-to-br
                  from-violet-500/[0.07]
                  to-cyan-500/[0.025]

                  shadow-[inset_0_0_30px_rgba(139,92,246,0.035)]
                "
              >

                <div
                  className="
                    absolute

                    inset-2.5
                    sm:inset-3

                    rounded-xl

                    border
                    border-dashed
                    border-violet-400/10
                  "
                />

                <div
                  className="
                    relative

                    h-2.5
                    w-2.5

                    sm:h-3
                    sm:w-3

                    rounded-full

                    bg-violet-400

                    shadow-[0_0_18px_rgba(167,139,250,0.8)]
                  "
                />

                <div
                  className="
                    absolute
                    top-2.5
                    right-3
                    sm:top-3
                    sm:right-4

                    h-1
                    w-1

                    rounded-full

                    bg-cyan-400/60
                  "
                />

                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    sm:bottom-4
                    sm:left-4

                    h-1
                    w-1

                    rounded-full

                    bg-violet-300/40
                  "
                />

              </div>


              <h3
                className="
                  relative

                  mt-5
                  sm:mt-6

                  text-[12px]
                  sm:text-sm

                  font-medium

                  tracking-[0.06em]
                  sm:tracking-[0.08em]

                  text-gray-400
                "
              >
                Begin a conversation
              </h3>


              <p
                className="
                  relative

                  mt-2

                  max-w-[270px]
                  sm:max-w-xs

                  text-[9px]
                  sm:text-[10px]

                  leading-5

                  text-gray-700
                "
              >
                Your private neural workspace is ready.
                Ask anything to begin.
              </p>


              <div
                className="
                  relative

                  mt-4
                  sm:mt-5

                  flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-white/[0.06]

                  bg-white/[0.02]

                  px-3
                  py-1.5
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    shrink-0

                    rounded-full

                    bg-cyan-400/70

                    shadow-[0_0_7px_rgba(34,211,238,0.5)]
                  "
                />

                <span
                  className="
                    text-[7px]
                    sm:text-[8px]

                    tracking-[0.16em]
                    sm:tracking-[0.18em]

                    text-gray-700
                  "
                >
                  SYSTEM READY
                </span>

              </div>

            </div>

          </div>

        ) : (

          /* ================================================= */
          /* MESSAGE LIST */
          /* ================================================= */

          <div
            className="
              w-full

              max-w-4xl

              mx-auto

              space-y-4
              sm:space-y-5
              md:space-y-6
            "
          >

            {messages.map((message) => (

              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end pl-4 sm:pl-8"
                    : "flex justify-start pr-4 sm:pr-8"
                }
              >

                <div
                  className={`
                    group
                    relative

                    w-fit

                    max-w-[94%]
                    sm:max-w-[85%]
                    md:max-w-[78%]

                    min-w-0

                    rounded-2xl

                    border

                    px-3.5
                    sm:px-4
                    md:px-5

                    py-3
                    sm:py-3.5
                    md:py-4

                    transition-all
                    duration-200

                    break-words

                    ${
                      message.role === "user"
                        ? `
                          bg-gradient-to-br
                          from-violet-500/[0.10]
                          to-violet-500/[0.035]

                          border-violet-400/15

                          text-gray-300

                          shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                        `
                        : `
                          bg-white/[0.025]

                          border-white/[0.07]

                          text-gray-400

                          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                        `
                    }
                  `}
                >

                  {/* Top highlight */}
                  <div
                    className="
                      pointer-events-none

                      absolute
                      inset-x-3
                      sm:inset-x-4

                      top-0

                      h-px

                      bg-gradient-to-r
                      from-transparent
                      via-white/[0.08]
                      to-transparent
                    "
                  />


                  {/* Message identity */}
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      sm:gap-2

                      mb-2
                      sm:mb-2.5
                    "
                  >

                    <span
                      className={`
                        flex

                        h-4
                        min-w-4

                        items-center
                        justify-center

                        rounded

                        px-1

                        text-[6px]
                        sm:text-[7px]

                        font-semibold

                        tracking-wider

                        ${
                          message.role === "user"
                            ? `
                              bg-violet-400/10
                              text-violet-300/70
                            `
                            : `
                              bg-cyan-400/[0.06]
                              text-cyan-400/50
                            `
                        }
                      `}
                    >
                      {message.role === "user"
                        ? "YOU"
                        : "AI"
                      }
                    </span>


                    <span
                      className="
                        h-px
                        w-3
                        sm:w-4

                        bg-white/[0.06]
                      "
                    />


                    <span
                      className="
                        text-[6px]
                        sm:text-[7px]

                        tracking-[0.14em]

                        uppercase

                        text-gray-700
                      "
                    >
                      {message.role === "user"
                        ? "input"
                        : "response"
                      }
                    </span>

                  </div>


                  {/* Message content */}
                  <p
                    className="
                      max-w-full

                      overflow-wrap-anywhere
                      break-words

                      text-[12px]
                      sm:text-[13px]

                      leading-5
                      sm:leading-6

                      whitespace-pre-wrap

                      text-gray-300/90
                    "
                  >
                    {message.content}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ================================================= */}
      {/* INPUT / COMPOSER */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-20

          shrink-0

          border-t
          border-white/[0.06]

          bg-[#09090d]/90

          px-3
          sm:px-4
          md:px-5

          py-3
          sm:py-4

          backdrop-blur-xl
        "
      >

        {/* Composer ambient glow */}
        <div
          className="
            pointer-events-none

            absolute
            left-1/2
            top-0

            h-16
            sm:h-20

            w-64
            sm:w-96

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-violet-500/[0.025]

            blur-3xl
          "
        />


        <form
          onSubmit={handleSendMessage}
          className="
            relative

            w-full

            max-w-4xl

            mx-auto
          "
        >

          <div
            className="
              group

              relative

              flex
              items-end
              gap-1.5
              sm:gap-2

              rounded-2xl

              border
              border-white/[0.08]

              bg-white/[0.025]

              p-1.5

              shadow-[0_10px_40px_rgba(0,0,0,0.2)]

              transition-all
              duration-200

              focus-within:border-violet-400/20
              focus-within:bg-violet-500/[0.025]
              focus-within:shadow-[0_0_35px_rgba(139,92,246,0.06)]
            "
          >

            {/* Input accent */}
            <div
              className="
                absolute

                left-4
                top-3

                h-1
                w-1

                rounded-full

                bg-violet-400/60

                opacity-0

                transition-opacity

                group-focus-within:opacity-100

                shadow-[0_0_8px_rgba(167,139,250,0.8)]
              "
            />


            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentThread
                  ? "Continue the conversation..."
                  : "Ask something..."
              }
              disabled={loading}
              rows={1}
              className="
                min-h-[40px]
                sm:min-h-[42px]

                max-h-32

                min-w-0

                flex-1

                resize-none

                bg-transparent

                px-3
                sm:px-4

                py-2.5

                text-[12px]
                sm:text-[13px]

                text-gray-300

                placeholder-gray-700

                outline-none

                disabled:opacity-40

                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-white/[0.08]
              "
            />


            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="
                group/send

                relative

                h-10
                sm:h-10

                min-w-[60px]
                sm:min-w-[82px]

                shrink-0

                overflow-hidden

                rounded-xl

                border
                border-violet-400/15

                bg-violet-500/[0.08]

                px-2.5
                sm:px-4

                text-[8px]
                sm:text-[9px]

                font-medium

                tracking-[0.14em]
                sm:tracking-[0.18em]

                text-violet-300/70

                hover:border-violet-400/30
                hover:bg-violet-500/[0.14]
                hover:text-violet-200

                disabled:cursor-not-allowed
                disabled:opacity-20

                active:scale-[0.97]

                transition-all
                duration-200
              "
            >

              {/* Button light sweep */}
              <span
                className="
                  absolute
                  inset-0

                  -translate-x-full

                  bg-gradient-to-r
                  from-transparent
                  via-violet-300/[0.08]
                  to-transparent

                  transition-transform
                  duration-500

                  group-hover/send:translate-x-full
                "
              />

              <span className="relative">

                <span className="hidden sm:inline">
                  {loading
                    ? "PROCESSING"
                    : "SEND"
                  }
                </span>

                <span className="sm:hidden">
                  {loading ? "..." : "↑"}
                </span>

              </span>

            </button>

          </div>


          {/* Composer metadata */}
          <div
            className="
              mt-1.5
              sm:mt-2

              flex
              items-center
              justify-between

              px-1
              sm:px-2
            "
          >

            <span
              className="
                text-[6px]
                sm:text-[7px]

                tracking-[0.12em]
                sm:tracking-[0.14em]

                text-gray-800
              "
            >
              <span className="hidden sm:inline">
                ENTER TO SEND
              </span>

              <span className="sm:hidden">
                SEND
              </span>
            </span>


            <span
              className="
                text-[6px]
                sm:text-[7px]

                tracking-[0.12em]
                sm:tracking-[0.14em]

                text-gray-800
              "
            >
              PRIVATE SESSION
            </span>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Messages;
