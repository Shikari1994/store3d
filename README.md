 Frontend                                                                                                                                         
  - React 18 + TypeScript + Vite                                                                                                                     - Three.js / React Three Fiber — рендер 3D                                                                                                       
  - Tailwind CSS, Zustand, TanStack Query                                                                                                            - Хостинг: GitHub Pages (/store3d/), деплой через GitHub Actions                                                                                                                                                                                                                                      Backend                                                                                                                                            - Fastify (Node.js + TypeScript)                                                                                                                   - Хостинг: Vercel (serverless), URL: backend-six-lime-43.vercel.app                                                                                                                                                                                                                                 
  Database
  - MongoDB Atlas (облако), база store3d

  3D модели
  - Хранятся прямо в репозитории: frontend/public/models/*.glb
  - Раздаются как статика через Vite / GitHub Pages

  Admin panel
  - Отдельное React + Vite приложение (порт 5174 в dev)

  Структура монорепо:
  store3d/
  ├── frontend/   → GitHub Pages
  ├── backend/    → Vercel
  └── admin/      → отдельное приложение
