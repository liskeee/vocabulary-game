'use client';

export default function Home() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden text-[var(--text-color)]"
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 items-center justify-center py-12">
          <div
            className="layout-content-container flex w-full max-w-4xl flex-col items-center gap-12 px-4 py-8"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <h1
                className="text-5xl font-black tracking-tighter text-[var(--text-color)]"
              >
                Choose Your Challenge
              </h1>
              <p className="max-w-md text-lg text-gray-600">
                Select a game to start practicing your English skills in a fun
                and interactive way.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
              <a
                className="game-card flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-12 text-center shadow-lg"
                href="/quiz"
              >
                <div
                  className="rounded-full bg-[var(--primary-light-color)] p-5 text-[var(--primary-color)]"
                >
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    height="48"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5 12.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    ></path>
                    <path
                      d="M18.5 12.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    ></path>
                    <path
                      d="M18.5 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    ></path>
                    <path
                      d="M18.5 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    ></path>
                    <path
                      d="M5.5 12.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold">Quiz Game</h3>
                  <p className="text-gray-500">
                    Test your knowledge with multiple-choice questions.
                  </p>
                </div>
                <button
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-pink-600 transition-colors"
                >
                  <span>Play Now</span>
                </button>
              </a>
              <a
                className="game-card flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-12 text-center shadow-lg"
                href="/flashcards"
              >
                <div
                  className="rounded-full bg-[var(--primary-light-color)] p-5 text-[var(--primary-color)]"
                >
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    height="48"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="18" rx="2" width="18" x="3" y="3"></rect>
                    <path d="M7 3v18"></path>
                    <path d="M12 3v18"></path>
                    <path d="M17 3v18"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold">Flashcards</h3>
                  <p className="text-gray-500">
                    Memorize new vocabulary with interactive cards.
                  </p>
                </div>
                <button
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-pink-600 transition-colors"
                >
                  <span>Start Learning</span>
                </button>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
