export default function TherapyBotPage() {
  return (
    <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
      <iframe
        src="http://localhost:3001/avatar"
        className="w-full h-full border-none"
        title="Therapy Bot"
        allow="microphone"
      />
    </div>
  );
}