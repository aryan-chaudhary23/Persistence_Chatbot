function Header({ onMenuClick }) {
  return (
    <header
      className="
        relative
        h-16
        w-full
        shrink-0
        overflow-hidden
        border-b border-white/[0.06]
        bg-[#07070a]/95
        backdrop-blur-xl

        flex
        items-center
        justify-between

        px-3
        sm:px-4
        md:px-6

        text-gray-300
      "
    >

      {/* ================================================= */}
      {/* AMBIENT LIGHTING */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -top-20
          left-[10%]
          h-32
          w-48
          sm:w-72
          rounded-full
          bg-violet-500/[0.07]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -top-20
          right-[10%]
          h-32
          w-40
          sm:w-64
          rounded-full
          bg-cyan-500/[0.05]
          blur-3xl
        "
      />

      {/* Top highlight */}
      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-violet-500/30
          to-transparent
        "
      />


      {/* ================================================= */}
      {/* LEFT — MENU + BRAND */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          min-w-0
          flex
          items-center
          gap-2
          sm:gap-3
        "
      >

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open conversations"
          className="
            md:hidden
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center

            rounded-lg
            border
            border-white/[0.08]
            bg-white/[0.025]

            text-gray-500

            transition-all
            duration-200

            hover:border-violet-400/25
            hover:bg-violet-500/[0.06]
            hover:text-violet-300

            active:scale-95
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
            />
          </svg>
        </button>


        {/* AI Core */}
        <div
          className="
            relative
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
          "
        >

          <div
            className="
              absolute
              inset-0
              rounded-lg
              bg-violet-500/10
              blur-md
            "
          />

          <div
            className="
              relative
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              border
              border-violet-400/20
              bg-gradient-to-br
              from-violet-500/10
              to-cyan-500/10
              shadow-[inset_0_0_12px_rgba(139,92,246,0.08)]
            "
          >
            <div
              className="
                h-2
                w-2
                rounded-full
                bg-violet-400
                shadow-[0_0_10px_rgba(167,139,250,0.9)]
              "
            />
          </div>

          <div
            className="
              absolute
              inset-0
              rounded-lg
              border
              border-cyan-400/10
              rotate-45
            "
          />

        </div>


        {/* Brand text */}
        <div className="min-w-0">

          <h1
            className="
              truncate
              text-[13px]
              sm:text-[15px]
              font-semibold
              tracking-[0.14em]
              sm:tracking-[0.18em]
              text-gray-200
            "
          >
            GPT<span className="text-violet-400">_</span>CHAT
          </h1>

          <div
            className="
              mt-0.5
              hidden
              xs:flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[8px]
                sm:text-[9px]
                tracking-[0.16em]
                sm:tracking-[0.22em]
                uppercase
                text-gray-600
              "
            >
              Neural Workspace
            </span>

            <span
              className="
                h-1
                w-1
                shrink-0
                rounded-full
                bg-violet-400/70
                shadow-[0_0_6px_rgba(167,139,250,0.7)]
              "
            />

            <span
              className="
                hidden
                sm:inline
                text-[9px]
                tracking-[0.18em]
                uppercase
                text-gray-700
              "
            >
              Secure
            </span>
          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* CENTER — STATUS */}
      {/* ================================================= */}

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2

          hidden
          sm:flex

          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.06]
            bg-white/[0.02]
            px-2.5
            sm:px-3
            py-1.5
            shadow-[inset_0_0_12px_rgba(255,255,255,0.015)]
            whitespace-nowrap
          "
        >

          <span
            className="
              relative
              flex
              h-1.5
              w-1.5
              shrink-0
            "
          >
            <span
              className="
                absolute
                inline-flex
                h-full
                w-full
                animate-ping
                rounded-full
                bg-cyan-400/40
              "
            />

            <span
              className="
                relative
                inline-flex
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-400
                shadow-[0_0_8px_rgba(34,211,238,0.8)]
              "
            />
          </span>

          <span
            className="
              text-[8px]
              sm:text-[9px]
              font-medium
              tracking-[0.16em]
              sm:tracking-[0.22em]
              text-cyan-400/80
            "
          >
            ONLINE
          </span>

          <span
            className="
              h-3
              w-px
              bg-white/[0.08]
            "
          />

          <span
            className="
              text-[8px]
              sm:text-[9px]
              tracking-[0.12em]
              text-gray-600
            "
          >
            READY
          </span>

        </div>

      </div>


      {/* ================================================= */}
      {/* RIGHT — CONTROLS */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          shrink-0
          items-center
          gap-2
          sm:gap-3
        "
      >

        {/* Encryption indicator */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-2
          "
        >

          <span
            className="
              h-1
              w-1
              rounded-full
              bg-gray-600
            "
          />

          <span
            className="
              text-[9px]
              tracking-[0.18em]
              text-gray-600
              uppercase
            "
          >
            encrypted
          </span>

        </div>


        {/* Settings */}
        <button
          className="
            group
            relative
            overflow-hidden

            rounded-lg
            border
            border-white/[0.08]
            bg-white/[0.025]

            px-2.5
            sm:px-3.5

            py-1.5

            text-[9px]
            sm:text-[10px]

            tracking-[0.08em]
            sm:tracking-[0.12em]

            text-gray-500

            backdrop-blur-md

            transition-all
            duration-200

            hover:border-violet-400/25
            hover:bg-violet-500/[0.06]
            hover:text-violet-300

            active:scale-[0.97]
          "
        >

          <span
            className="
              absolute
              inset-0
              -translate-x-full
              bg-gradient-to-r
              from-transparent
              via-violet-400/[0.08]
              to-transparent
              transition-transform
              duration-500
              group-hover:translate-x-full
            "
          />

          <span className="relative">
            <span className="hidden sm:inline">
              Settings
            </span>

            <span className="sm:hidden">
              ⚙
            </span>
          </span>

        </button>

      </div>

    </header>
  );
}

export default Header;
