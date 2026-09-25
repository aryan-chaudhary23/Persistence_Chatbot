function Footer() {
  return (
    <footer
      className="
        relative
        h-10
        w-full
        shrink-0
        overflow-hidden

        border-t
        border-white/[0.06]

        bg-[#07070a]/95

        flex
        items-center
        justify-between

        px-3
        sm:px-4
        md:px-6

        text-[9px]
        sm:text-[10px]

        tracking-wider

        backdrop-blur-xl
      "
    >

      {/* ================================================= */}
      {/* AMBIENT LIGHTING */}
      {/* ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-px

          bg-gradient-to-r
          from-transparent
          via-violet-500/20
          to-transparent
        "
      />


      {/* ================================================= */}
      {/* LEFT — SYSTEM STATUS */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          gap-1.5
          sm:gap-2

          min-w-0
        "
      >

        {/* Status indicator */}
        <span className="
          relative
          flex
          h-1.5
          w-1.5
          shrink-0
        ">

          <span className="
            absolute
            inline-flex
            h-full
            w-full

            animate-ping

            rounded-full

            bg-cyan-400/30
          " />

          <span className="
            relative
            inline-flex
            h-1.5
            w-1.5

            rounded-full

            bg-cyan-400

            shadow-[0_0_7px_rgba(34,211,238,0.7)]
          " />

        </span>


        <span
          className="
            truncate

            text-[7px]
            sm:text-[9px]

            tracking-[0.12em]
            sm:tracking-wider

            text-gray-600
          "
        >
          <span className="hidden sm:inline">
            SYSTEM // READY
          </span>

          <span className="sm:hidden">
            READY
          </span>
        </span>

      </div>


      {/* ================================================= */}
      {/* CENTER — VERSION */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          hidden
          sm:flex

          items-center
          gap-2

          text-gray-700
        "
      >

        <span className="
          h-1
          w-1

          rounded-full

          bg-violet-400/30
        " />

        <span className="
          text-[8px]
          tracking-[0.16em]
        ">
          GPT_CHAT
        </span>

        <span className="
          text-[8px]
          text-gray-800
        ">
          //
        </span>

        <span className="
          font-mono
          text-[8px]
          text-violet-400/40
        ">
          v1.0.0
        </span>

      </div>


      {/* ================================================= */}
      {/* RIGHT — SESSION */}
      {/* ================================================= */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          gap-2
          sm:gap-3

          text-gray-600
        "
      >

        <span
          className="
            hidden
            sm:inline

            text-[8px]
            tracking-[0.16em]
          "
        >
          SESSION
        </span>


        <span
          className="
            flex
            items-center
            gap-1.5

            text-[7px]
            sm:text-[8px]

            tracking-[0.12em]
            sm:tracking-[0.14em]

            text-cyan-400/50
          "
        >

          <span className="
            h-1
            w-1

            rounded-full

            bg-cyan-400/60

            shadow-[0_0_5px_rgba(34,211,238,0.5)]
          " />

          ACTIVE

        </span>


        <span className="
          text-gray-800
        ">
          |
        </span>


        <span
          className="
            text-[7px]
            sm:text-[8px]

            text-gray-700
          "
        >
          2026
        </span>

      </div>

    </footer>
  );
}

export default Footer;
