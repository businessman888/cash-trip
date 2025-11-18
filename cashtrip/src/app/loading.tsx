export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1E293B] to-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Carregando...</p>
      </div>
    </div>
  );
}

